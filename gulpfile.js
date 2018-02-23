const gulp = require('gulp');
const packages = require('/www/package.json');
const $ = require('gulp-load-plugins')({
  config: packages
});

const globby = require('globby');
const rollup = require('rollup').rollup;
const resolve = require('rollup-plugin-node-resolve');
const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
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
    ampUncssIgnore = [];

gulp.task('build', [
  // 'markup',
  // 'compile:yaml',
  // 'styles',
  // 'jsBundle',
  // 'jsUglify',
  // 'optimize:svgMin',
  // 'optimize:svgSprites',
  // 'optimize:image',
  // 'build:move',
  // 'build:inject',
  // 'ampUncss',
  // 'ampInject',
  // 'check:w3cHTML'
  // 'check:w3cCSS'
]);

// Default Task
gulp.task('default', [
  'build',
  'server', 
  'watch',
]);  

gulp.task('markup', () => {
  let data = requireUncached('./' + templates + '/data.json');
  doNunjucks(data, [templates + '/*.njk'], '.');
});

// styles
gulp.task('styles', () => { doSassPostcss(); });

// scripts
gulp.task('jsBundle', () => { doJsBundle(); });
gulp.task('jsUglify', () => { doJsUglify(); })

let svgMinSrc = 'src/svg/*.svg',
    svgSpritesSrc = 'src/svg/sprites/*.svg',
    svgDest = 'assets/svg';
gulp.task('optimize:svgMin', () => { doSvgMin(svgMinSrc, svgDest); });
gulp.task('optimize:svgSprites', () => { doSvgSprites(svgSpritesSrc, svgDest); });
gulp.task('watch:svgMin', () => { gulp.watch(svgMinSrc, (e) => { watcher(e, 'src/', 'assets/', doSvgMin); }); });
gulp.task('watch:svgSprites', () => { gulp.watch(svgSpritesSrc, ['optimize:svgSprites']); });

gulp.task('build:move', () => {
  doMove([
    'bower_components/html5shiv/dist/html5shiv.js' 
  ], 'assets/js');
});

gulp.task('build:inject', () => {
  let svg4everybody = gulp.src('bower_components/svg4everybody/dist/svg4everybody.legacy.min.js');
  // let modernizrJs = gulp.src('src/js/*.js')
  //   .pipe($.modernizr({
  //         'minify': true,
  //         'options': ['setClasses'],
  //         'tests': ['touchevents'],
  //       }))
  //   .pipe($.uglify());
  doInject('templates/partials/layout.njk', 'templates/partials');
});

let imageSrc = 'src/img/**/*.{jpg,jpeg,png,gif}';
gulp.task('optimize:image', () => { doImageMin(imageSrc, 'assets/img'); });
gulp.task('watch:image', () => { gulp.watch([imageSrc], (e) => { watcher(e, 'src/img', 'assets/img', doImageMin); }); });

// amp
gulp.task('amp', () => {
  doAmpUncss();
  doAmpInject();
});

gulp.task('server', () => { browserSync.init({
  server: { baseDir: './'},
  ghostMode: false,
  open: false,
  notify: false
}); });

let htmlSrc = ['*.html', '!pages.html'];
gulp.task('check:w3cHTML', () => { doW3cHTML(htmlSrc); });
gulp.task('watch:w3cHTML', () => { gulp.watch(htmlSrc, (e) => {
  let name = path.basename(e.path, '.html');

  if (['deleted', 'changed'].indexOf(e.type) >= 0 ) {
    del('w3cErrors/W3C_Errors/' + name + 'html_validation-report.html');
  }

  if (e.type === 'changed') { doW3cHTML(e.path); }
}); });

let cssSrc = assets + '/css' + '/*.css';
gulp.task('check:w3cCSS', () => { doW3cCSS(cssSrc); });
gulp.task('watch:w3cCSS', () => { gulp.watch(cssSrc, ['check:w3cCSS'])});

gulp.task('watch', [
    'watch:svgMin',
    'watch:svgSprites',
    'watch:image',
    // 'watch:w3cHTML',
    // 'watch:w3cCSS',
  ], () => {
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
        } else {
          return;
        }
      } else {
        src = e.path;
      }

      doNunjucks(data, src, '.');
    }
  });
  // styles
  gulp.watch(src + '/scss/**/*.scss', (e) => {
    if (path.dirname(e.path) === __dirname + '/' + src + '/scss') {
      if (e.type === 'deleted') {
        return del(assets + '/css/' + path.parse(e.path).name + '.css');
      } else {
        doSassPostcss(e.path);
      }
    } else {
      doSassPostcss();
    }
  });
  // scripts
  gulp.watch(src + '/js/**/*.js', (e) => {
    if (path.dirname(e.path) === __dirname + '/' + src + '/js') {
      if (e.type === 'deleted') {
        return del(e.path.replace(src, assets));
      } else {
        doJsBundle(e.path);
      }
    } else {
      doJsBundle();
    }
  });
  gulp.watch(assets + '/js/*.js', (e) => {
    if (e.path.indexOf('.min.') < 0) {
      if (e.type === 'deleted') {
        return del(path.dirname(e.path) + '/min/' + path.basename(e.path));
      } else {
        doJsUglify(e.path);
      }
    }
  });
  // amp
  gulp.watch(assets + '/css/main.css', () => {
    doAmpUncss();
    doAmpInject();
  });
  // update page list
  gulp.watch(['**/*.html'], (e) => {
    if (['deleted', 'added'].indexOf(e.type) >= 0) { pages = getAllFilesFromFolder(__dirname, '.html'); }
  });
  gulp.watch(['**/*.html', 'assets/js/*.js']).on('change', browserSync.reload);
});








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
    .pipe(gulp.dest(assets + '/js/min'));
}

function doMove (src, dest) {
  return gulp.src(src)
    .pipe(gulp.dest(dest));
}

function doSvgMin (src, dest) {
  return gulp.src(src)
      .pipe($.svgmin())
      .pipe(gulp.dest(dest));
}

function doSvgSprites (src, dest) {
  return gulp.src(src)
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
    .pipe(gulp.dest(dest));
}

function doInject (src, dest) {
  return gulp.src(src)
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

function doImageMin (src, dest) {
  return gulp.src(src)
    .pipe($.imagemin())
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
          .replace('@page{margin:0.5cm}', '')
          .replace(/"..\/img/g, '"assets/img');
      }
    }))
    .pipe(gulp.dest('.'));
}

function doW3cHTML (src) {
  // clear cache
  // rmAllFiles('w3cErrors/W3C_Errors', function () { console.log('"w3cErrors/W3C_Errors" was removed'); });

  return gulp.src(src)
    .pipe($.w3cHtmlValidation({
      // generateCheckstyleReport: 'w3cErrors/validation.xml',
      errorTemplate: 'w3cErrors/w3c_validation_error_template.html',
      useTimeStamp: false,
      // remotePath: "http://decodize.com/", // use regex validation for domain check
      // remoteFiles: ["blog/2013/03/03/getting-started-with-yeoman-1-dot-0-beta-on-windows/",
      //   "blog/2015/01/09/front-end-d-workflow-redefined-jade/",
      //   "blog/2013/08/07/front-end-viewpoints-architecture-building-large-websites/",
      //   "blog/2013/03/10/linktomob-share-your-links-quickly-and-easily-on-mobile-devices/",
      //   "blog/2013/02/09/slidemote-universal-remote-control-for-html5-presentations/"],
      relaxerror: [
        // 'The "banner" role is unnecessary for element "header".'
        'The “banner” role is unnecessary for element “header”.',
        'The “navigation” role is unnecessary for element “nav”.',
        'The “main” role is unnecessary for element “main”.',
        'The “contentinfo” role is unnecessary for element “footer”.',
        // 'The “(\w+)” role is unnecessary for element “([A-Z])\w+”.'
                   ]
    }));
}

function doW3cCSS (src) {
  return gulp.src(src)
    .pipe($.w3cCss())
    .pipe($.rename({extname: '.json'}))
    .pipe(gulp.dest('w3cErrors/css'));
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
