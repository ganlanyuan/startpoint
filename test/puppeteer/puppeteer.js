const fs = require("fs"),
      path = require('path'),
      PNG = require('pngjs').PNG,
      pixelmatch = require('pixelmatch'),
      browserSync = require("browser-sync").create(),
      puppeteer = require('puppeteer'),
      imagemin = require('imagemin'),
      imageminPngquant = require('imagemin-pngquant');
      // execFile = require('child_process').execFile,
      // pngquant = require('pngquant-bin');

let port = 2000,
    // dirShort = '',
    dirShort = 'test/puppeteer/',
    files = [
      'index',
      'article'
    ],
    viewports = {
      sm: {
        width: 320,
        height: 640
      },
      md: {
        width: 768,
        height: 1024
      },
      lg: {
        width: 1024,
        height: 768
      },
      xlg: {
        width: 1400,
        height: 900
      }
    },
    serverOptions = {
      server: { baseDir: './'},
      port: port,
      ghostMode: false,
      open: false,
      notify: false,
      // logLevel: "silent",
    },
    arr = [];




browserSync.init(serverOptions, function () {
  if (process.env.var === 'compare') {
    checkReferenceExists();
    // checkDirectoryExists('new');
    // checkDirectoryExists('diff');

    getScreenshots('new').then(function() {
      compareScreenshots();
    });

  } else if (process.env.var === 'save') {
    // checkDirectoryExists('reference');
    getScreenshots('reference');

  }
  // browserSync.exit();
});






// FUNCTIONS
function compareScreenshots () {
  let promises = [];
  console.log('Compare Screenshots:')
  for (size in viewports) {
    for (let i = 0, l = files.length; i < l; i++) {
      let file = files[i];
      promises.push(compareScreenshot(file, size));
    }
  }

  Promise.all(promises).then(function(values) {
    fs.writeFile(__dirname + '/data.js', 'let files = ' + JSON.stringify(arr, null, 2) + ';', function(err) {
      if(err) { return console.log(err); }
      console.log('  data.js saved!');
    }); 
  });
}

function compareScreenshot(file, size) {
  return new Promise((resolve, reject) => {
    const img1 = fs.createReadStream(__dirname + '/new/' + size + '_' + file + '.png').pipe(new PNG()).on('parsed', doneReading);
    const img2 = fs.createReadStream(__dirname + '/reference/' + size + '_' + file + '.png').pipe(new PNG()).on('parsed', doneReading);

    let filesRead = 0;
    function doneReading() {
      // Wait until both files are read.
      if (++filesRead < 2) return;

      // The files should be the same size.
      // expect(img1.width, 'image widths are the same').equal(img2.width);
      // expect(img1.height, 'image heights are the same').equal(img2.height);

      // Do the visual diff.
      const diff = new PNG({width: img1.width, height: img1.height});
      const numDiffPixels = pixelmatch(
          img1.data, img2.data, diff.data, img1.width, img1.height,
          {threshold: 0.1});

      let symbol = numDiffPixels ? '✗' : '✓';
      if (numDiffPixels) {
        arr.push(size + '_' + file);
        diff.pack().pipe(fs.createWriteStream(__dirname + '/diff/' + size + '_' + file + '.png'));
      }
      console.log(' ', symbol, size + '_' + file + '.html');
      resolve();
    }
  });
}

function checkReferenceExists () {
  if (!fs.existsSync(__dirname + '/reference/sm_' + files[0] + '.png')) {
    mkDirByPathSync('reference', {isRelativeToScript: true});
    getScreenshots('reference');
  }
}

function checkDirectoryExists (dir) {
  if (!fs.existsSync(__dirname + '/' + dir)) {
    mkDirByPathSync(dir, {isRelativeToScript: true});
  }
}

async function getScreenshots (dir) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('/' + dir);
  for (let size in viewports) {
    await page.setViewport(viewports[size]);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      await page.goto('http://localhost:' + port + '/' + file + '.html', {waitUntil: 'domcontentloaded'});
      await page.screenshot({path: __dirname + '/temp/' + dir + '/' + size + '_' + file + '.png', fullPage: true});
      await console.log(' ', size + '_' + file + '.png');
    }
  }

  await browser.close();
  await console.log('  Screenshots saved!');
  await imagemin([__dirname + '/temp/' + dir + '/*.png'], __dirname + '/' + dir, {use: [imageminPngquant()]}).then(() => {
    console.log('Images optimized');
  });
}



// https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync#40686853
function mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
      console.log(`Directory ${curDir} created!`);
    } catch (err) {
      if (err.code !== 'EEXIST') { throw err; }
      // console.log(`Directory ${curDir} already exists!`);
    }
    return curDir;
  }, initDir);
}


