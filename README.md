# startpoint

A simple boilerplate for websites.    

###Before you start
We use `php` to organize our markup. You can run php file locally by setting up a local sever environment via <a href="http://www.mamp.info/en/" target="_blank">MAMP</a>.     
We use <a href="http://bower.io/" target="_blank">bower</a> to manage our packages. 
We use task runner <a href="http://gulpjs.com/">gulp</a> to automate our front-end tasks.

###Content
```html
startpoint/ 
|── src/ <!-- scss, js source code -->  
|   |── js/              
|   |── scss/              
|   |── svg/              
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
**src**: source files (SCSS, js).    
**Part**: php components (header, footer, sidebar, ...).    
**Assets**: final files (css, js, images, fonts, svg).     
**assets/cross-domain**: for `respond.js` in case you put css file on CDN. Click <a href="https://github.com/scottjehl/Respond" target="_blank">here</a> for more details.   

