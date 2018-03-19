const fs = require("fs"),
      path = require('path'),
      PngQuant = require('pngquant'),
      myPngQuanter = new PngQuant([192, '--quality', '60-80', '--nofs', '-']);

// const {execFile} = require('child_process');
// const optipng = require('optipng-bin');
const execFile = require('child_process').execFile;
const pngquant = require('pngquant-bin');

let files = [
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
    };
rmAllFiles(__dirname + '/reference/pngquant', minifyPng);

function minifyPng () {
  for (size in viewports) {
    for (let i = 0, l = files.length; i < l; i++) {
      let file = files[i];

      execFile(pngquant, ['-o', __dirname + '/reference/pngquant/' + size + '_' + file + '.png', __dirname + '/reference/' + size + '_' + file + '.png'], err => {
        console.log('Image minified!');
      });

      // execFile(optipng, ['-out', __dirname + '/reference/pngquant/' + size + '_' + file + '.png', __dirname + '/reference/' + size + '_' + file + '.png'], err => {
      //   console.log('Image minified!');
      // });

      // fs.createReadStream(__dirname + '/reference/' + size + '_' + file + '.png')
      //   .pipe(myPngQuanter)
      //   .pipe(fs.createWriteStream(__dirname + '/reference/pngquant/' + size + '_' + file + '.png'));
    }
  }
}

function rmAllFiles (dirPath, callback) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        rmAllFiles(filePath);
      }
    }
    callback();
  } else {
    callback();
  }
  // fs.rmdirSync(dirPath);
};