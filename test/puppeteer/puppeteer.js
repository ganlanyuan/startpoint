const fs = require("fs"),
      path = require('path'),
      yaml = require('js-yaml'),
      PNG = require('pngjs').PNG,
      pixelmatch = require('pixelmatch'),
      { imgDiff } = require('img-diff-js'),
      browserSync = require("browser-sync").create(),
      puppeteer = require('puppeteer');
      // imagemin = require('imagemin'),
      // imageminPngquant = require('imagemin-pngquant');

let config = {};
try {
  config = yaml.safeLoad(fs.readFileSync(__dirname + '/config.yml', 'utf8'));
} catch (e) { console.log(e); }
let pages = config.pages,
    parts = config.parts,
    ignore = config.ignore,
    viewports = config.viewports,
    port = config.port;

let serverOptions = {
      server: { baseDir: './'},
      port: port,
      ghostMode: false,
      open: false,
      notify: false,
      logLevel: "silent",
    },
    arr = [],
    promises = [];




browserSync.init(serverOptions, function () {
  if (process.env.var === 'compare') {
    // checkReferenceExists();
    getScreenshots('current').then(function() {
      compareScreenshots();
    });

  } else if (process.env.var === 'save') {
    getScreenshots('reference');
  }
  // browserSync.exit();
});






// FUNCTIONS
function compareScreenshots () {
  console.log('Compare Screenshots:')
  for (size in viewports) {
    for (let i = 0, l = pages.length; i < l; i++) {
      let file = pages[i];
      promises.push(compareScreenshot(file, size));
    }
  }

  Promise.all(promises).then(function(values) {
    arr.sort();
    fs.writeFile(__dirname + '/errorPages.js', 'let pages = ' + JSON.stringify(arr, null, 2) + ';', function(err) {
      if(err) { return console.log(err); }
      if (arr.length) {
        console.log('Some pages changed from last time\nhttp://localhost:' + port + '/test/puppeteer');
      } else {
        console.log('No changes found!')
      }
    }); 
  });
}

function compareScreenshot (file, size, isPart) {
    return imgDiff({
      actualFilename: __dirname + '/reference/' + size + '_' + file + '.png',
      expectedFilename: __dirname + '/current/' + size + '_' + file + '.png',
      diffFilename: __dirname + '/diff/' + size + '_' + file + '.png',
      generateOnlyDiffFile: true,
      options: {
        threshold: 0.1
      }
    }).then(result => {
      let symbol;
      if (result.diffCount > 1) {
        symbol = '✗';
        arr.push(size + '_' + file);

        // compare parts
        if (!isPart && parts && parts.length) {
          for (let a = parts.length; a--;) {
            try {
              promises.push(compareScreenshot(file + '_' + parts[a], size, true));
            } catch (e) { console.log(e); }
          }
        }
      } else {
        symbol = '✓';
      }

      console.log(' ', symbol, size + '_' + file + '.html');
    });
}

async function getScreenshots (dir) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let silent = dir === 'reference';

  if (!silent) { console.log('/' + dir); }
  for (let size in viewports) {
    await page.setViewport(viewports[size]);

    for (let i = 0; i < pages.length; i++) {
      let file = pages[i];
      await page.goto('http://localhost:' + port + '/' + file + '.html', {waitUntil: 'load'});

      // ignore elements
      if (ignore && ignore.length) {
        await page.addStyleTag({content: ignore.toString() + '{opacity:0 !important}'});
      }

      // full page screenshot
      await page.screenshot({path: __dirname + '/' + dir + '/' + size + '_' + file + '.png', fullPage: true});
      if (!silent) { await console.log(' ', size + '_' + file + '.png'); }

      // elements screenshots
      if (parts && parts.length) {
        for (let a = parts.length; a--;) {
          let part = parts[a];

          try {
            let rect = await page.$eval(part, e => [e.offsetLeft, e.offsetTop, e.offsetWidth, e.offsetHeight] );
            await page.screenshot({
              path: __dirname + '/' + dir + '/' + size + '_' + file + '_' + part + '.png', 
              clip: {
                x : rect[0],
                y : rect[1], 
                width : rect[2], 
                height : rect[3]
              }
            });
            if (!silent) { await console.log(' ', size + '_' + file + '_' + part + '.png'); }
          } catch (e) { console.log(e); }
        }
      }
    }
  }

  await browser.close();
  await console.log('  Screenshots saved!');

  // // minify screenshots
  // await imagemin([__dirname + '/temp/' + dir + '/*.png'], __dirname + '/' + dir, {use: [imageminPngquant()]}).then(() => {
  //   console.log('/' + dir + '\n', ' ', 'Images optimized');
  // });
}


// function checkReferenceExists () {
//   if (!fs.existsSync(__dirname + '/reference/' + Object.keys(viewports)[0] + '_' + pages[0] + '.png')) {
//     mkDirByPathSync('reference', {isRelativeToScript: true});
//     getScreenshots('reference');
//   }
// }

// function checkDirectoryExists (dir) {
//   if (!fs.existsSync(__dirname + '/' + dir)) {
//     mkDirByPathSync(dir, {isRelativeToScript: true});
//   }
// }


// // https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync#40686853
// function mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
//   const sep = path.sep;
//   const initDir = path.isAbsolute(targetDir) ? sep : '';
//   const baseDir = isRelativeToScript ? __dirname : '.';

//   targetDir.split(sep).reduce((parentDir, childDir) => {
//     const curDir = path.resolve(baseDir, parentDir, childDir);
//     try {
//       fs.mkdirSync(curDir);
//       console.log(`Directory ${curDir} created!`);
//     } catch (err) {
//       if (err.code !== 'EEXIST') { throw err; }
//       // console.log(`Directory ${curDir} already exists!`);
//     }
//     return curDir;
//   }, initDir);
// }