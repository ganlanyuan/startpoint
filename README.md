# startpoint

A simple boilerplate for building website.    

###Before you start
We use `php` to organize our `html` part. You can run php file locally, if you set up a local sever environment via <a href="http://www.mamp.info/en/" target="_blank">MAMP</a> or <a href="https://www.apachefriends.org/index.html" target="_blank">XAMPP</a>.     
We use <a href="http://bower.io/" target="_blank">bower</a> to manage our packages. You can use [npm](https://www.npmjs.com/) too.     
We use <a href="http://incident57.com/codekit/" target="_blank">codekit</a> to compile `scss` and minify `js`. You can use <a href="http://koala-app.com/" target="_blank">koala</a>, <a href="http://gruntjs.com/" target="_blank">grunt</a> or <a href="http://gulpjs.com/">gulp</a> instead.

###Content
```html
startpoint/ 
|── src/ <!-- scss, js source code -->  
|   |── js/              
|   |── scss/              
|
|── part/ <!-- page components: header, footer, navigation, sidebar -->  
|   |── ad/ <!-- ad placement -->             
|   |── helper/              
|       |── browsehappy.php <!-- fallback for IE7 and below -->              
|       |── no-js.php <!-- fallback for non-javascript browsers -->             
|
|── assets/ <!-- final css, js files -->  
|   |── background-size-polyfill/ <!-- add background-size supports for old browser -->|             
|   |── cross-domain/ <!-- for respond.js -->             
|   |── css/               
|   |── img/              
|   |── js/              
|   |── svg/              
|
|── bower_components/ <!-- components downloaded via bower -->  
|── bower.json <!-- bower configuration -->  
```
**Bower_components**: the packages downloaded through bower.    
**src**: source files (SCSS, js).    
**Part**: php components (header, footer, sidebar, ...).    
**Assets**: final files (css, js, images, fonts, svg).     

1. **cross-domain** folder (inside assets folder) is for `respond.js` in case you put css file on CDN. Please refer to <a href="https://github.com/scottjehl/Respond" target="_blank">here</a> for details of usage.   
2. **ie.js** (assets/js/) contains `Respond.js`, `NWMatcher 1.2.5` and `selectivizr`. `Respond.js` adds CSS-mediaquery supports to old browsers, and `selectivizr` adds CSS3-Selectors supports to old browsers.

