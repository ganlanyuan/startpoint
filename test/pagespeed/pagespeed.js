const browserSync = require('browser-sync').create();
const ngrok = require('ngrok');
const fs = require('fs');
const path = require("path");
const psi = require('psi');

let strategy = 'mobile',
    files = [
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
      pageSpeed(url + '/' + file, strategy, 'test/pagespeed/' + file);
    });
  }
});

function pageSpeed (url, strategy, file) {
  return psi(url, {nokey: 'true', strategy: strategy}).then(data => {
    let pageStats = data.pageStats,
        ruleResults = data.formattedResults.ruleResults;
    console.log('Url:' + data.id
              + '\nStrategy:' + 'mobile'
              + '\n\nSpeed:' + data.ruleGroups.SPEED.score
              + '\nUsability:' + data.ruleGroups.USABILITY.score
              + '\n\nCSS resources:' + pageStats.numberCssResources
              + '\nJavascript resources:' + pageStats.numberJsResources
              + '\nHTML size:' + setUnit(pageStats.htmlResponseBytes)
              + '\nText size:' + setUnit(pageStats.textResponseBytes)
              + '\nCSS size:' + setUnit(pageStats.cssResponseBytes)
              + '\nImage size:' + setUnit(pageStats.imageResponseBytes)
              + '\nJavascript size:' + setUnit(pageStats.javascriptResponseBytes)
              + '\nOther size:' + setUnit(pageStats.otherResponseBytes));

    let str = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title>Page speed</title><style>html {font-family: helvetica, arial, sans-serif; font-weight: 300;letter-spacing: 0.1px;line-height: 1.4;}body{max-width: 800px;margin:0 auto;}ul{list-style: none; padding: 0}strong {font-weight:bold;} code {background: #ff03; padding: 3px 5px; display: inline-block;}</style> </head> <body>';

    // numbers
    str += '<ul><li><strong>Url:</strong> ' + data.id + '</li>' 
        + '<li><strong>Strategy:</strong> ' + 'mobile' + '</li>' 
        + '<li><br><strong>Speed:</strong> ' + data.ruleGroups.SPEED.score + '</li>' 
        + '<li><strong>Usability:</strong> ' + data.ruleGroups.USABILITY.score + '</li>' 
        + '<li><br><strong>CSS resources:</strong> ' + pageStats.numberCssResources + '</li>' 
        + '<li><strong>Javascript resources:</strong> ' + pageStats.numberJsResources + '</li>' 
        + '<li><strong>HTML size:</strong> ' + setUnit(pageStats.htmlResponseBytes) + '</li>' 
        + '<li><strong>Text size:</strong> ' + setUnit(pageStats.textResponseBytes) + '</li>' 
        + '<li><strong>CSS size:</strong> ' + setUnit(pageStats.cssResponseBytes) + '</li>' 
        + '<li><strong>Image size:</strong> ' + setUnit(pageStats.imageResponseBytes) + '</li>' 
        + '<li><strong>Javascript size:</strong> ' + setUnit(pageStats.javascriptResponseBytes) + '</li>' 
        + '<li><strong>Other size:</strong> ' + setUnit(pageStats.otherResponseBytes) + '</li></ul>';

    for (let item in ruleResults) {
      let results = ruleResults[item],
          summary = results.summary,
          urlBlocks = results.urlBlocks;
      str += '<h2>' + item.match(/[A-Z][a-z0-9]*/g).join(' ') + '</h2>' + '<p><strong>Summary: </strong>' + getStr(summary) + '</p><p>';

      if (urlBlocks && urlBlocks.length) {
        urlBlocks.forEach(function(urlBlock) {
          let header = urlBlock.header,
              urls = urlBlock.urls;
          if (header) {
            str += getStr(header) + '<br>';
          }
          if (urls && urls.length) {
            urls.forEach(function(url) {
              str += getStr(url.result) + '<br>';
            });
          }
        });
      }
      // console.log(str);
    }
    str += '</body> </html>';

    fs.writeFile(file, str, function(err) {
      if(err) { return console.log(err); }
    });
  });
}

function getStr (obj) {
  let str = obj.format,
      keys = str.match(/{{\w+}}/g);

  if (keys && keys.length) {
    keys.forEach(function(key) {
      let shortKey = key.replace(/[{{|}}]/g, ''),
          value = '';

      obj.args.forEach(function(obj) {
        if (shortKey === 'END_LINK') {
          value = '</a>';
        } else if (shortKey === 'BEGIN_LINK' && obj.key === 'LINK') {
          value = '<a href="' + obj.value + '" target="_blank">';
        } else if (obj.key === shortKey){
          value = obj.value;
          if (shortKey === 'HTML_TEXT') {
            value = '<code>' + value.replace('<', '&lt;').replace('>', '&gt;') + '</code>';
          } else if (/^http/.test(value)) {
            value = '<a href="' + value + '" target="_blank">' + value + '</a>';
          }
        }
      });

      if (value) { str = str.replace(key, value); }
    })
  }

  return str + '\n';
}

function setUnit (n) {
  return n >= 1000000 ? precisionRound(n/1000000, 2) + 'MB' : precisionRound(n/1000, 2) + 'KB';
}

function precisionRound (number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor || 0;
}