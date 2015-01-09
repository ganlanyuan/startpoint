# startpoint

<p>A simple boilerplate for building website.</p>

<h3>Before you start</h3>
<ol>
  <li>We use php to organize our html part. You can run php file locally by install <a href="http://www.mamp.info/en/" target="_blank">MAMP</a> or <a href="https://www.apachefriends.org/index.html" target="_blank">XAMPP</a>.</li>
  <li>We use <a href="http://bower.io/" target="_blank">bower</a> to organize our packages.</li>
  <li>We use <a href="http://incident57.com/codekit/" target="_blank">codekit</a> to compile SCSS and minify js. You can use <a href="http://koala-app.com/" target="_blank">koala</a> instead, it's free. Also you can use <a href="http://gruntjs.com/" target="_blank">grunt</a> or <a href="http://gulpjs.com/">gulp</a> to manually set up you workflow.</li>
</ol>

<h3>What's inside</h3>
<p>There are 4 folders under the root: <strong>assets</strong>, <strong>bower_components</strong>, <strong>dev</strong> and <strong>part</strong>. <strong>Bower_components</strong> contains the packages we get through bower. <strong>Dev</strong> contains SCSS and js files. <strong>Part</strong> contains php components (e.g. header, footer). <strong>Assets</strong> contains final css, js, fonts and images.</p>
<ol>
  <li><strong>Cross-domain</strong> folder (inside assets folder) is for respond.js when you use css on CDN. Please refer to <a href="https://github.com/scottjehl/Respond" target="_blank">here</a>.</li>
  <li><strong>Ie.js</strong> (assets/js/) contains Respond.js, NWMatcher 1.2.5 and selectivizr. Respond.js make old browser support css-mediaquery, and selectivizr make old browser support css3 selectors.</li>
</ol>

