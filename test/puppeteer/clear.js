const fs = require("fs"),
      path = require('path');

['/reference', '/current', '/diff'].forEach(function(name) {
  rmAllFiles(__dirname + name, function() {
    console.log(name, 'is cleared!')
  });
});

function rmAllFiles (dirPath, callback) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }

  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile() && path.extname(filePath) === '.png') {
        fs.unlinkSync(filePath);
      } else {
        rmAllFiles(filePath);
      }
    }
  } else {
    callback();
  }
};