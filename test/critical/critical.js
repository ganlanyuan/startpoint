const critical = require('critical');

let assets = 'assets';

critical.generate({
  base: './', 
  src: 'index.html',
  inline: false, 
  css: [assets + '/css/main.css'],
  dest: assets + '/css/critical.css',
  dimensions: [ {
    width: 320,
    height: 568,
  }, {
    width: 768,
    height: 1024,
  }, {
    width: 1024,
    height: 768,
  }, {
    width: 1200,
    height: 900,
  }]
}).then(function(output) {
  console.log('done!');
}).error(function(err) {
  console.log(err);
});