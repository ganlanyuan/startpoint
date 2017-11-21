// var t0 = Date.now();

// var async = require('async');
var fs = require('fs');
var path = require('path');
var localtunnel = require('localtunnel');

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
// var firefox = require('selenium-webdriver/firefox');
// var binary = new firefox.Binary(firefox.Channel.NIGHTLY);
// binary.addArguments("-headless");

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    // .setFirefoxOptions(new firefox.Options().setBinary(binary))
    .usingServer('http://localhost:4444/wd/hub')
    .build();

// var webdriverio = require('webdriverio');
        
// var options = { 
//     host: 'localhost',
//     desiredCapabilities: { 
//         browserName: 'firefox', 
//         version: '56.0' 
//     } 
// };
// var client = webdriverio.remote(options);

var baseurl = 'https://validator.w3.org/nu/?showoutline=yes&doc=',
    pages = getAllFilesFromFolder(__dirname, '.html'),
    len = pages.length;

var tunnel = localtunnel(3000, function(err, tunnel) {
  if (err) { console.log(err); }
  console.log(tunnel.url);

  // client.init();

  // async.each(pages, function(pagename, callback) {
    // console.log(baseurl + tunnel.url + '/' + pagename + '.html');
    // client
    //   .init()
    //   .url('https://www.google.com/')
    //   // .url(baseurl + tunnel.url + '/' + pagename + '.html')
    //   .getTitle().then(function(title) {
    //       console.log('Title was: ' + title);
    //   })
    //   .saveScreenshot('google.png').then(function() {
    //     console.log('google');
    //   })
    //   .end();
  // }, function(err){
  //   if (err) { console.log(err); }
  // });

  // async.each(pages, function(pagename, callback) {
  //   driver.navigate().to(baseurl + tunnel.url + '/' + pagename + '.html');
  //   // driver.manage().window().maximize();

  //   driver.findElement(By.css('#results')).takeScreenshot().then(function(data){
  //     // console.log(index + 1 + '/' + pages.length);
  //     var base64Data = data.replace(/^data:image\/png;base64,/,"")
  //     fs.writeFile('w3cErrors/screenshot/' + pagename + '.png', base64Data, 'base64', function(err) {
  //       if(err) { console.log(err); }
  //       console.log(pages.indexOf(pagename) + 1 + '/' + len + ' ' + pagename + '.html is done');

  //       if (pagename === pages[len - 1]) {
  //         tunnel.close();

  //         var t1 = Date.now();
  //         console.log('All done, tasks took ' + (t1 - t0) / 1000 + ' seconds.')
  //       }
  //     });

  //   });
  // }, function(err){
  //   if (err) { console.log(err); }
  // });

  pages.forEach(function(page, index) {
    // console.log(baseurl + tunnel.url + '/' + page + '.html');
    driver.navigate().to(baseurl + tunnel.url + '/' + page + '.html');
    // driver.manage().window().maximize();

    // Errors
    driver.findElement(By.css('#results ol')).takeScreenshot().then(function(data){
      var str = index + 1;
      console.log('=> '+ str + '/' + pages.length + ' ' + page);
      var base64Data = data.replace(/^data:image\/png;base64,/,"")
      fs.writeFile('w3cErrors/screenshot/' + page + '-error.png', base64Data, 'base64', function(err) {
        if(err) { console.log(err); }
        console.log('  error is done');
      });
    });

    // Heading Outline
    driver.findElement(By.css('#headingoutline')).takeScreenshot().then(function(data){
      var base64Data = data.replace(/^data:image\/png;base64,/,"")
      fs.writeFile('w3cErrors/screenshot/' + page + '-outline.png', base64Data, 'base64', function(err) {
        console.log('  outline is done');

        if (index === pages.length - 1) {
          tunnel.close();

          // var t1 = Date.now();
          // console.log('All done, tasks took ' + (t1 - t0) / 1000 + ' seconds.')
        }
      });

    });
  });

  driver.quit();

});

function getAllFilesFromFolder (dir, fileExt) {
  if (fs.existsSync(dir)) {
    var results = [], files = fs.readdirSync(dir);

    if (files.length > 0) {
      files.forEach(function(file) {

          file = dir+'/'+file;

          var stat = fs.statSync(file);
          if (stat && stat.isDirectory()) {
            // results = results.concat(getAllFilesFromFolder(file))
          } else if (path.extname(file) === fileExt) {
            file = file.replace(dir + '/', '').replace(fileExt, '');

            if (file !== 'pages') { results.push(file); }
          }
      });
    }

    return results;
  }
}


// // new tab
// driver.findElement(By.css("body")).sendKeys(webdriver.KeysCONTROL + "t");
// driver.navigate().to(baseurl + tunnel.url + '/' + pagename + '.html');

// //move to very first tab.
// driver.findElement(By.css("body"))
//         .sendKeys(Keys.CONTROL + "\t");

// // To close the current tab.    
// driver.findElement(By.css("body")).sendKeys(webdriver.KeysCONTROL + "w");

// selenium new tab: https://stackoverflow.com/questions/11358316/selenium-webdriver-open-new-tab-instead-of-a-new-window#answer-28697450
// selenium screenshot: https://stackoverflow.com/questions/3422262/take-a-screenshot-with-selenium-webdriver#answer-16882197