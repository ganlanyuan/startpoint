# startpoint

A simple boilerplate for website.

###Before you start
I use `Nunjucks` to organize the markup.

###Content
```html
startpoint/
|── src/ <!-- Njk, scss, js source code -->
|   |── html/
|       |── parts/ <!-- page components: header, footer, navigation, sidebar -->
|   |── js/
|   |── scss/
|   |── svg/
|
|── public/ <!-- final html files -->
|   |── assets/ <!-- final css, js files -->
|       |── background-size-polyfill/ <!-- add background-size supports for old browser -->|
|       |── cross-domain/ <!-- for respond.js -->
|       |── css/
|       |── img/
|       |── js/
|       |── svg/
|
|── test/ <!-- tests -->
|
|── node_modules/ <!-- components downloaded via npm -->
|── package.json <!-- npm configuration -->
```
