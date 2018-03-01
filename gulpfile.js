const gulp = require('gulp');
const packages = require('/www/package.json');
const $ = require('gulp-load-plugins')({ config: packages });

const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const w3cHtml = require('@ganlanyuan/w3cjs');
const amphtmlValidator = require('amphtml-validator');
const request = require('request'); // for w3cCSS
const ngrok = require('ngrok');

const rollup = require('rollup').rollup;
const resolve = require('rollup-plugin-node-resolve');
const buble = require('rollup-plugin-buble');
const globby = require('globby'); // for rollup

const path = require('path');
const del = require('del');
const fs = require("fs");
const rimraf = require('rimraf');

let dev = true;
let sourcemapDest = '../sourcemaps';
let pages = getAllFilesFromFolder(__dirname, '.html');
let src = 'src',
    assets = 'assets',
    templates = 'templates',
    ampUncssIgnore = [],
    moveFiles = {
      'assets/js': [],
      'src/js': []
    },
    cssSrc = ['assets/css/main.css'],
    publicUrl = '',
    cssValidateLevel = 'css3';

gulp.task('build', [
  // 'markup',
  // 'styles',
  // 'jsBundle',
  // 'jsUglify',
  // 'images',
  // 'svgSprites',
  // 'move',
  // 'criticalCss',
  // 'amp',
  // 'htmlValidate',
  // 'cssValidate',
]);


// markup
gulp.task('markup', () => {
  let data = requireUncached('./' + templates + '/data.json');
  doNunjucks(data, [templates + '/*.njk'], '.');
});
// styles
gulp.task('styles', () => { doSassPostcss(); });
gulp.task('criticalCss', () => {
  let critical = gulp.src(assets + '/css/critical.css');
  return gulp.src(templates + '/parts/layout.njk')
    .pipe($.inject(critical, {
      starttag: '/* critical:css */',
      endtag: '/* endinject */',
      transform: function(filePath, file) { return file.contents.toString(); }
    }))
    .pipe(gulp.dest(templates + '/parts'))
});
// scripts
gulp.task('jsBundle', () => { doJsBundle(); });
gulp.task('jsUglify', () => { doJsUglify(); })
// images
gulp.task('images', () => { doImageMin(); });
// svg sprites
gulp.task('svgSprites', () => { doSvgSprites(); });
// move
gulp.task('move', () => { for (var dest in moveFiles) { doMove(moveFiles[dest], dest); } });
// amp
gulp.task('amp', () => {
  doAmpUncss();
  doAmpInject();
});
// html validate
gulp.task('htmlValidate', () => { htmlValidator(); });
// css validate
gulp.task('cssValidate', () => { checkCss(cssSrc); });
// amp validate
gulp.task('ampValidate', () => { ampValidator(); });
// server
gulp.task('server', () => { browserSync.init({
  server: { baseDir: './'},
  ghostMode: false,
  open: false,
  notify: false
}); });

// Default Task
gulp.task('default', [
  'server', 
  'build',
  'watch',
]);  
gulp.task('watch', () => {
  // markup
  gulp.watch([templates + '/**/*.njk', templates + '/data.json'], (e) => {
    if (e.type === 'deleted') {
      return del(path.parse(e.path).name + '.html');
    } else {
      let data = requireUncached('./' + templates + '/data.json'), src;

      if (e.path.indexOf('parts/') >= 0 ) {
        if (e.path.indexOf('layout-') !== -1) {
          let fullname = path.parse(e.path).name.replace('layout-', '') + '.njk';
          src = [templates + '/' + fullname, templates + '/mb-' + fullname];
        } else if (e.path.indexOf('/layout.njk') !== -1 || path.extname(e.path) === '.json') {
          src = [templates + '/*.njk', '!' + templates + '/pages.njk'];
        } else { return; }
      } else { src = e.path; }

      doNunjucks(data, src, '.');
    }
  });
  // styles
  gulp.watch(src + '/scss/**/*.scss', (e) => {
    if (path.dirname(e.path) === __dirname + '/' + src + '/scss') {
      if (e.type === 'deleted') {
        return del(assets + '/css/' + path.parse(e.path).name + '.css');
      } else { doSassPostcss(e.path); }
    } else { doSassPostcss(); }
  });
  gulp.watch(assets + '/css/critical.css', ['criticalCss']);
  // scripts
  gulp.watch(src + '/js/**/*.js', (e) => {
    if (path.dirname(e.path) === __dirname + '/' + src + '/js') {
      if (e.type === 'deleted') {
        return del(e.path.replace(src, assets));
      } else { doJsBundle(e.path); }
    } else { doJsBundle(); }
  });
  gulp.watch(assets + '/js/*.js', (e) => {
    if (e.path.indexOf('.min.') < 0) {
      if (e.type === 'deleted') {
        return del(path.dirname(e.path) + '/min/' + path.basename(e.path));
      } else { doJsUglify(e.path); }
    }
  });
  // images
  gulp.watch([src + '/img/**/*'], (e) => { 
    if (e.type === 'deleted') {
      return del(e.path.replace(src, assets));
    } else { doImageMin(e.path); }
  });
  // svg sprites
  gulp.watch(src + '/svg-sprites/*.svg', ['svgSprites']);
  // amp
  gulp.watch(assets + '/css/main.css', () => {
    doAmpUncss();
    doAmpInject();
  });
  // html validate
  gulp.watch(['*.html', '!amp.html'], (e) => { htmlValidator([e.path]); });
  // css validate
  gulp.watch(cssSrc, (e) => { checkCss([e.path]); });
  // amp validate
  gulp.watch('amp.html', (e) => { ampValidator(e.path); });
  // update page list
  gulp.watch(['**/*.html'], (e) => {
    if (['deleted', 'added'].indexOf(e.type) >= 0) { pages = getAllFilesFromFolder(__dirname, '.html'); }
  });
  // reload browser
  gulp.watch(['**/*.html', 'assets/js/*.js']).on('change', browserSync.reload);
});






























// #########
function watcher (e, srcFolder, destFolder, callback) {
  let destFile = e.path.replace(srcFolder, destFolder),
      destPath = path.dirname(destFile);

  if (e.type === 'added' || e.type === 'changed' || e.type === 'renamed') {
    callback(e.path, destPath);
  } else if (e.type === 'deleted') {
    return del(destFile);
  }
}

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

function requireUncached ( $module ) {
  delete require.cache[require.resolve( $module )];
  return require( $module );
}

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
            file = file.replace(__dirname + '/', '').replace(fileExt, '');

            if (file !== 'pages') { results.push(file); }
          }
      });
    }

    return results;
  }
}

function doNunjucks (data, src, dest) {
  data.year = new Date().getFullYear();
  data.pages = pages;
  let base = -1,
      imageCount = base,
      headingCount = base,
      paragraphCount = base,
      imageCountMax = data.images.length - 1,
      headingCountMax = data.headings.length - 1,
      paragraphCountMax = data.paragraphs.length - 1;
  data.getIC = () => {
    imageCount = imageCount >= imageCountMax ? 0 : imageCount + 1;
    return imageCount;
  };
  data.getHC = () => {
    headingCount = headingCount >= headingCountMax ? 0 : headingCount + 1;
    return headingCount;
  };
  data.getPC = () => {
    paragraphCount = paragraphCount >= paragraphCountMax ? 0 : paragraphCount + 1;
    return paragraphCount;
  };

  data.is = function(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
  };
  data.keys = function(obj) { return Object.keys(obj); };
  data.belongTo = function(str, arr) { return arr.indexOf(str) !== -1; };
  data.push = function(arr, str) { arr.push(str); return arr; };

  return gulp.src(src)
    .pipe($.plumber())
    // compile njk to html
    .pipe($.nunjucks.compile(data), {
      watch: true,
      noCache: true,
    })
    // change extension from ".njk" to ".html"
    .pipe($.rename(function(path) { path.extname = ".html"; }))
    // prettify | minify
    .pipe($.if(dev, $.htmltidy({
      doctype: 'html5',
      wrap: 0,
      hideComments: false,
      indent: true,
      'indent-attributes': false,
      'drop-empty-elements': false,
      'force-output': true
    }), $.htmlmin({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      collapseBooleanAttributes: true,
      decodeEntities: true,
      minifyCSS: true,
      minifyJs: true,
      removeComments: false,
    })))
    .pipe(gulp.dest(dest));
}

function doSassPostcss (file) {
  if (!file) { file = src + '/scss/*.scss'; }
  return gulp.src(file)  
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass({
      outputStyle: 'compressed', 
      precision: 7
    }).on('error', $.sass.logError))  
    // add prefixes
    .pipe($.postcss([ autoprefixer() ]))
    // add normalize
    .pipe($.postcss([require('postcss-normalize')({ /* options */ }) ]))
    // minify
    .pipe($.csso())
    .pipe($.if(dev, $.sourcemaps.write(sourcemapDest)))
    .pipe(gulp.dest(assets + '/css'));
}

function doJsBundle (files) {
  if (!files) { files = src + '/js/*.js'; }

  return globby.sync(files).map(inputFile => (rollup({
    input: inputFile,
    context: 'window',
    treeshake: true,
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      buble(),
    ],
  }).then(function(bundle) {
    return bundle.write({
      file: inputFile.replace(src, assets),
      format: 'iife',
      // moduleName: 'tns',
    });
  })));
}

function doJsConcat (name, src, dest) {
  return gulp.src(src)
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.concat(name))
    .pipe($.uglify({
      // mangle: false,
      output: {
        quote_keys: true,
      },
      compress: {
        properties: false,
      }
    }))
    .on('error', errorlog)  
    .pipe($.if(dev, $.sourcemaps.write(sourcemapDest)))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
}

function doJsUglify (d) {
  let s = d ? d : assets + '/js/*.js';

  return gulp.src(s)
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    // .pipe($.uglify({
    //   // mangle: false,
    //   output: {
    //     quote_keys: true,
    //   },
    //   compress: {
    //     properties: false,
    //   }
    // }))
    .on('error', errorlog)  
    .pipe($.if(dev, $.sourcemaps.write(sourcemapDest)))
    .pipe(gulp.dest(assets + '/js/min'));
}

function doMove (src, dest) {
  return gulp.src(src)
    .pipe(gulp.dest(dest));
}

function doSvgSprites () {
  return gulp.src(src + '/svg-sprites/*.svg')
    .pipe($.svgmin(function(file) {
      let prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }],
        // js2svg: { pretty: true }
      }
    }))
    .pipe($.svgstore({ inlineSvg: true }))
    .pipe($.rename('sprites.svg'))
    .pipe(gulp.dest(assets + '/svg-sprites'));
}

function doInject (src, dest) {
  return gulp.src(src)
    .pipe($.if(critical, $.inject(critical, {
      starttag: '/* critical:css */',
      endtag: '/* endinject */',
    })))
    .pipe($.if(svg4everybody, $.inject(svg4everybody, {
      starttag: '/* svg4everybody:js */',
      endtag: '/* endinject */',
      transform: function(filePath, file) {
        return file.contents.toString().replace('height:100%;width:100%', '');
      }
    })))
    .pipe($.if(modernizrJs, $.inject(modernizrJs, {
      starttag: '/* modernizr:js */',
      endtag: '/* endinject */',
      transform: function(filePath, file) {
        return file.contents.toString();
      }
    })))
    .pipe(gulp.dest(dest));
}

function doImageMin (img) {
  var dest = assets + '/img';
  if (img) {
    dest = path.dirname(img).replace(src, assets);
  } else {
    img = src + '/img/**/*.{jpg,jpeg,png,gif}';
  }
  return gulp.src(img)
    .pipe($.image())
    .pipe(gulp.dest(dest));
}

function doAmpUncss () {
  return gulp.src(assets + '/css/main.css')
    .pipe($.uncss({
      html: ['amp.html'],
      ignore: ampUncssIgnore,
    }))
    .pipe($.rename('amp.css'))
    .pipe(gulp.dest(assets + '/css'));
}

function doAmpInject () {
  return gulp.src('amp.html')
    .pipe($.inject(gulp.src('assets/svg/sprites.svg'), {
      transform: function(filePath, file) { return file.contents.toString(); }
    }))
    .pipe($.inject(gulp.src(assets + '/css/amp.css'), {
      starttag: '/* inject:css */',
      endtag: '/* endinject */',
      transform: function (filePath, file) {
        return file.contents.toString()
          .replace(/fonts\/mnr/g, 'assets/css/fonts/mnr')
          .replace(/!important/g, '')
          .replace('@page{margin:.5cm}', '')
          .replace(/"..\/img/g, '"assets/img');
      }
    }))
    .pipe(gulp.dest('.'));
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
  } else {
    callback();
  }
  fs.rmdirSync(dirPath);
};

let htmlValidatorFilters = [
    'The “banner” role is unnecessary for element “header”.', 
    'The “navigation” role is unnecessary for element “nav”.',
    'The “main” role is unnecessary for element “main”.',
    'The “contentinfo” role is unnecessary for element “footer”.'
  ];
function htmlValidator (arr) {
  if (!arr) { arr = pages; }
  arr.forEach(function(file, index) {
    if (file.indexOf('.html') < 0) { file += '.html'; }

    // output: json => Terminal
    w3cHtml.validate({
      file: file, // file can either be a local file or a remote file
      output: 'json',
      callback: function (err, res) {
        var str = '';
        if (res.messages.length > 0) {
          res.messages.forEach(function(m) {
            // check if messages match filters
            if (htmlValidatorFilters.indexOf(m.message) < 0) {
              str += m.type + ', line ' + m.lastLine + ', col ' + m.firstColumn + '-' + m.lastColumn + ', ' + m.message;
            }
          });

          // if there are some messages after filter
          // display them
          var num = Math.round(Math.random() * 100);
          if (str.length > 0) { console.log(res.context.replace('/www/web/', '') + '_' + num + ': \n' + str); }
        }
      }
    });

    // output: html => file
    w3cHtml.validate({
      file: file, // file can either be a local file or a remote file
      output: 'html',
      callback: function (err, res) {
        res = res.slice(0, 38) + '<meta charset="utf-8">' + res.slice(38); // add charset
        fs.writeFile('/www/web/test/w3c/html/' + path.parse(file).name + '.html', res, function(err) {
          if(err) { return console.log(err); }
        }); 
      }
    });
  });
}

function checkCss (files) {
  if (publicUrl) {
    cssValidator(files);
  } else {
    ngrok.connect(3000, function (err, url) {
        if (err) {
          console.log('ngrok:', err);
          checkCss(files);
        } else {
          console.log(url);
          publicUrl = url;
          cssValidator(files);
        }
    });
  }
}

function cssValidator (arr) {
  arr.forEach(function(file) {
    request('https://jigsaw.w3.org/css-validator/validator?uri=' + publicUrl.replace('://', '%3A%2F%2F') + '%2F' + file.replace('/www/web/', '') + '&profile=' + cssValidateLevel + '&usermedium=all&warning=1&vextwarning=&lang=en', function(error, response, body) {
      if (error) {
        console.log('CSS Validate Errors:', error); // Print the error if one occurred
      } else {
        console.log('CSS validating: ' + file.replace('/www/web/', '') + ',', response && response.statusCode);
        // console.log('body:', body); // Print the HTML
      }
    })
    .pipe(fs.createWriteStream('test/w3c/css/' + path.parse(file).name + '.html'));
  });
}

function ampValidator () {
  fs.readFile('amp.html', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      amphtmlValidator.getInstance().then(function (validator) {
        var result = validator.validateString(data);
        ((result.status === 'PASS') ? console.log : console.error)('AMP ' + result.status.toLowerCase());
        result.errors.forEach(function(error) {
          var msg = 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
          if (error.specUrl) { msg += ' (see ' + error.specUrl + ')'; }
          ((error.severity === 'ERROR') ? console.error : console.warn)(msg);
        });
      });
    }
  })
}