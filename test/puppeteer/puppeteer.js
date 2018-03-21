const fs = require("fs"),
      path = require('path'),
      yaml = require('js-yaml'),
      PNG = require('pngjs').PNG,
      pixelmatch = require('pixelmatch'),
      browserSync = require("browser-sync").create(),
      puppeteer = require('puppeteer'),
      imagemin = require('imagemin'),
      imageminPngquant = require('imagemin-pngquant');
      // execFile = require('child_process').execFile,
      // pngquant = require('pngquant-bin');

let config = {};
try {
  config = yaml.safeLoad(fs.readFileSync(__dirname + '/config.yml', 'utf8'));
} catch (e) { console.log(e); }
let pages = config.pages,
    parts = config.parts,
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
    getScreenshots('new').then(function() {
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
    for (let i = 0, l = files.length; i < l; i++) {
      let file = files[i];
      promises.push(compareScreenshot(file, size));
    }
  }

  Promise.all(promises).then(function(values) {
    arr.sort();
    fs.writeFile(__dirname + '/data.js', 'let files = ' + JSON.stringify(arr, null, 2) + ';', function(err) {
      if(err) { return console.log(err); }
      if (arr.length) {
        console.log('Some pages changed from last time\nhttp://localhost:2000/test/puppeteer');
      } else {
        console.log('No changes found!')
      }
    }); 
  });
}

function compareScreenshot (file, size, isPart) {
  return new Promise((resolve, reject) => {
    let img1 = fs.createReadStream(__dirname + '/new/' + size + '_' + file + '.png').pipe(new PNG()).on('parsed', doneReading);
    let img2 = fs.createReadStream(__dirname + '/reference/' + size + '_' + file + '.png').pipe(new PNG()).on('parsed', doneReading);

    let filesRead = 0;
    function doneReading() {
      // Wait until both files are read.
      if (++filesRead < 2) return;

      // The files should be the same size.
      // expect(img1.width, 'image widths are the same').equal(img2.width);
      // expect(img1.height, 'image heights are the same').equal(img2.height);

      // Do the visual diff.
      let diff = new PNG({width: img1.width, height: img1.height});
      let numDiffPixels = pixelmatch(
          img1.data, img2.data, diff.data, img1.width, img1.height,
          {threshold: 0.1}),
          symbol;

      if (numDiffPixels > 1) {
        symbol = '✗';

        arr.push(size + '_' + file);
        diff.pack().pipe(fs.createWriteStream(__dirname + '/diff/' + size + '_' + file + '.png'));

        // compare elements
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
      resolve();
    }
  });
}

async function getScreenshots (dir) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('/' + dir);
  for (let size in viewports) {
    await page.setViewport(viewports[size]);

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      await page.goto('http://localhost:' + port + '/' + file + '.html', {waitUntil: 'load'});

      // ignore elements
      if (file === 'article') {
        await page.$eval('iframe', iframe => {iframe.style.opacity = 0;});
      }

      // full page screenshot
      await page.screenshot({path: __dirname + '/' + dir + '/' + size + '_' + file + '.png', fullPage: true});
      await console.log(' ', size + '_' + file + '.png');

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
            await console.log(' ', size + '_' + file + '_' + part + '.png');
          } catch (e) {}
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
//   if (!fs.existsSync(__dirname + '/reference/' + Object.keys(viewports)[0] + '_' + files[0] + '.png')) {
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