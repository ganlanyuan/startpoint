const gulp = require('gulp');
const packages = require('/www/package.json');
const $ = require('gulp-load-plugins')({
  config: packages
});

const rollup = require('rollup').rollup;
const resolve = require('rollup-plugin-node-resolve');
const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const path = require('path');
const del = require('del');
let dev = true;
let sourcemapDest = '../sourcemaps';

gulp.task('build', [
  // 'compile:markup',
  // 'compile:yaml',
  // 'compile:sass',
  // 'compile:postcss',
  // 'compile:scriptBundle',
  // 'optimize:scriptUglify',
  // 'optimize:svgMin',
  // 'optimize:svgSprites',
  // 'optimize:image',
  // 'build:move',
  // 'build:inject',
  // 'build:ampUncss',
  // 'build:ampInject',
]);

gulp.task('watch', [
    'watch:markup',
    'watch:yaml',
    'watch:sass',
    'watch:postcss',
    'watch:scriptBundle',
    'watch:scriptUglify',
    'watch:ampUncss',
    'watch:ampInject',
    'watch:svgMin',
    'watch:svgSprites',
    'watch:image',
  ], () => { gulp.watch(['**/*.html', 'assets/js/*.js']).on('change', browserSync.reload); });

// Default Task
gulp.task('default', [
  'build',
  'server', 
  'watch',
]);  

let markupSrc = 'templates';
gulp.task('compile:markup', () => {
  let data = requireUncached('./' + markupSrc + '/data.json');
  let src = markupSrc + '/*.njk';
  doNunjucks(data, src, '.');
});
gulp.task('compile:yaml', () => { doYamlToJson(markupSrc + '/*.yml', markupSrc); });
gulp.task('watch:markup', () => { gulp.watch([markupSrc + '/**/*.njk', markupSrc + '/data.json'], (e) => {
  if (e.type === 'deleted') {
    return del(path.parse(e.path).name + '.html');
  } else {
    let data = requireUncached('./' + markupSrc + '/data.json');
    let src = (e.path.indexOf('parts/') !== -1 || path.extname(e.path) === '.json') ? markupSrc + '/*.njk' : e.path;
    doNunjucks(data, src, '.');
  }
}); });
gulp.task('watch:yaml', () => { gulp.watch(markupSrc + '/*.yml', ['compile:yaml']); })

let scssSrc = 'src/scss';
let cssDest = 'assets/css';
gulp.task('compile:sass', () => { doSass(scssSrc + '/main.scss', cssDest); });
gulp.task('compile:postcss', () => { doPostCss(cssDest + '/main.css', cssDest); });
gulp.task('watch:sass', () => { gulp.watch(scssSrc + '/**/*.scss', ['compile:sass']); })
gulp.task('watch:postcss', () => { gulp.watch(cssDest + '/main.css', ['compile:postcss']); })

let scriptBundleSrc = 'src/js/slider.js',
    scriptBundleDest = 'assets/js/source/slider.js',
    scriptUglifySrc = 'assets/js/source/*.js',
    scriptUglifyDest = 'assets/js';
gulp.task('compile:scriptBundle', () => { doJsBundle(scriptBundleSrc, scriptBundleDest); });
gulp.task('optimize:scriptUglify', () => { doJsUglify(scriptUglifySrc, scriptUglifyDest); })
gulp.task('watch:scriptBundle', () => { gulp.watch(scriptBundleSrc, ['compile:scriptBundle']); });
gulp.task('watch:scriptUglify', () => { gulp.watch(scriptUglifySrc, (e) => { watcher(e, 'source/', '', doJsUglify); }); });

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

let ampCssSource = cssDest + '/main.final.css',
    ampCss = cssDest + '/amp.css',
    ampTarget = 'amp-article.html',
    ampUncssOptions = {
      html: ['amp-article.html'],
      // ignore: ['#sidebar', '#sidebar>ul>li>a', '.hasImgs li amp-img', '.hidden-svg'],
    };
gulp.task('build:ampUncss', () => { doAmpUncss(ampCssSource, cssDest, ampUncssOptions); });
gulp.task('build:ampInject', () => { doAmpInject(ampTarget, ampCss, '.'); });
gulp.task('watch:ampUncss', () => { gulp.watch(ampCssSource, () => { doAmpUncss(ampCssSource, cssDest, ampUncssOptions); })})
gulp.task('watch:ampInject', () => { gulp.watch(ampCss, () => { doAmpInject(ampTarget, ampCss, '.'); } ) });

gulp.task('server', () => { browserSync.init({
  server: { baseDir: './'},
  ghostMode: {
    clicks: false,
    forms: false,
    scroll: false
  },
  open: false,
  notify: false
}); });









function watcher(e, srcFolder, destFolder, callback) {
  let destFile = e.path.replace(srcFolder, destFolder),
      destPath = path.dirname(destFile);

  if (e.type === 'added' || e.type === 'changed' || e.type === 'renamed') {
    callback(e.path, destPath);
  } else if (e.type === 'deleted') {
    return del(destFile);
  }
}

function errorlog(error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

function requireUncached( $module ) {
  delete require.cache[require.resolve( $module )];
  return require( $module );
}

function doNunjucks(data, src, dest) {
  data.year = new Date().getFullYear();
  let iCount = 0,
      hCount = 0,
      pCount = 0;
  data.getICount = () => {
    if (iCount > 46) { iCount = 0; }
    return iCount += 1;
  };
  data.getHCount = () => {
    if (hCount > 46) { hCount = 0; }
    return hCount += 1;
  };
  data.getPCount = () => {
    if (pCount > 46) { pCount = 0; }
    return pCount += 1;
  };

  data.is = function (type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
  };
  data.keys = function (obj) { return Object.keys(obj); };
  data.belongTo = function (str, arr) { return arr.indexOf(str) !== -1; };

  return gulp.src(src)
    .pipe($.plumber())
    // compile njk to html
    .pipe($.nunjucks.compile(data), {
      watch: true,
      noCache: true,
    })
    // change extension from ".njk" to ".html"
    .pipe($.rename(function (path) { path.extname = ".html"; }))
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

function doSass(src, dest) {
  return gulp.src(src)  
    .pipe($.plumber())
    // .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass({
      outputStyle: 'compressed', 
      precision: 7
    }).on('error', $.sass.logError))  
    // .pipe($.if(dev, $.sourcemaps.write(sourcemapDest)))
    .pipe(gulp.dest(dest));
}

function doPostCss(src, dest) {
  return gulp.src(src)
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    // add prefixes
    .pipe($.postcss([ autoprefixer() ]))
    // add normalize
    .pipe($.postcss([require('postcss-normalize')({ /* options */ }) ]))
    // rename
    .pipe($.rename(function (path) { path.basename += '.final'; }))
    // minify
    .pipe($.csso())
    .pipe($.if(dev, $.sourcemaps.write(sourcemapDest)))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
}

function doJsBundle(src, dest) {
  return rollup({
    entry: src,
    context: 'window',
    treeshake: true,
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
    ],
  }).then(function (bundle) {
    return bundle.write({
      dest: dest,
      format: 'iife',
      // moduleName: 'tns',
    });
  });
}

function doJsConcat(name, src, dest) {
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

function doJsUglify(src, dest) {
  return gulp.src(src)
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
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
}

function doYamlToJson(src, dest) {
  return gulp.src(src)
    .pipe($.plumber())
    .pipe($.yaml({space: 2}))
    .pipe(gulp.dest(dest));
}

function doMove(src, dest) {
  return gulp.src(src)
    .pipe(gulp.dest(dest));
}

function doSvgMin(src, dest) {
  return gulp.src(src)
      .pipe($.svgmin())
      .pipe(gulp.dest(dest));
}

function doSvgSprites(src, dest) {
  return gulp.src(src)
    .pipe($.svgmin(function (file) {
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

function doInject(src, dest) {
  return gulp.src(src)
    .pipe($.if(svg4everybody, $.inject(svg4everybody, {
      starttag: '/* svg4everybody:js */',
      endtag: '/* endinject */',
      transform: function (filePath, file) {
        return file.contents.toString().replace('height:100%;width:100%', '');
      }
    })))
    .pipe($.if(modernizrJs, $.inject(modernizrJs, {
      starttag: '/* modernizr:js */',
      endtag: '/* endinject */',
      transform: function (filePath, file) {
        return file.contents.toString();
      }
    })))
    .pipe(gulp.dest(dest));
}

function doImageMin(src, dest) {
  return gulp.src(src)
    .pipe($.imagemin())
    .pipe(gulp.dest(dest));
}

function doAmpUncss(src, dest, options) {
  return gulp.src(src)
    .pipe($.uncss(options))
    .pipe($.rename('amp.css'))
    .pipe(gulp.dest(dest));
}

function doAmpInject(target, src, dest) {
  return gulp.src(target)
    .pipe($.inject(gulp.src('assets/svg/sprites.svg'), {
      transform: function (filePath, file) { return file.contents.toString(); }
    }))
    .pipe($.inject(gulp.src(src), {
      transform: function (filePath, file) {
        return '<style amp-custom>' + file.contents.toString().replace(/fonts\/mnr/g, 'assets/css/fonts/mnr').replace(/!important/g, '').replace('@page{margin:0.5cm}', '').replace(/"..\/img/g, '"assets/img') + '</style>';
      }
    }))
    .pipe(gulp.dest(dest));
}