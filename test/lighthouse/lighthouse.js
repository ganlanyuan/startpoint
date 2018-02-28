const browserSync = require('browser-sync').create();
const ngrok = require('ngrok');
const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const ReportGenerator = require('lighthouse/lighthouse-core/report/v2/report-generator');
const log = require('lighthouse-logger');
const opts = {
  logLevel: 'info',
  output: 'html',
  disableDeviceEmulation: true,
  chromeFlags: ['--show-paint-rects', '--headless']
};

let files = [
      'index.html',
    ];

browserSync.init({
  server: "./",
  port: 4000,
  open: false,
  ghostMode: false
});


ngrok.connect(4000, function (err, url) {
  if (err) {
    console.log(err);
  } else {
    console.log(url);

    files.forEach(function(file) {
      launchChromeAndRunLighthouse(url + '/' + file, opts).then(results => {
        fs.writeFile('test/lighthouse/' + file, results, function(err) {
          if (err) { console.log(err); }
        });
      });
    });
  }
});

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results =>
      chrome.kill().then(() => {
        delete results.artifacts;
        return new ReportGenerator().generateReportHtml(results);
      }));
  });
}
