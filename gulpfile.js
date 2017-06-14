const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const rollup = require('rollup').rollup;
const resolve = require('rollup-plugin-node-resolve');
const browserSync = require('browser-sync').create();
const autoprefixer = require('autoprefixer');
const path = require('path');
const del = require('del');
let dev = true;
let sourcemapDest = '../sourcemaps';

let markupSrc = 'templates';
gulp.task('compile:markup', () => {
  let data = requireUncached('./' + markupSrc + '/data.json');
  let src = markupSrc + '/*.njk';
  doNunjucks(data, src, '.');
});
gulp.task('watch:markup', () => { gulp.watch([markupSrc + '/**/*.njk', markupSrc + '/data.json'], ['compile:markup']); });

let scssSrc = 'src/scss';
let cssDest = 'assets/css';
gulp.task('compile:sass', () => { doSass(scssSrc + '/main.scss', cssDest); });
gulp.task('compile:postcss', () => { doPostCss(cssDest + '/main.css', cssDest); });
gulp.task('compile:styles', ['compile:sass', 'compile:postcss']);
gulp.task('watch:scss', () => { gulp.watch(scssSrc + '/**/*.scss', ['compile:sass']); })
gulp.task('watch:postcss', () => { gulp.watch(cssDest + '/main.css', ['compile:postcss']); })
gulp.task('watch:styles', ['watch:scss', 'watch:postcss']);

let scripts = {
  src:[
    'bower_components/go-native/dist/go-native.js',
    'bower_components/sticky/dist/sticky.native.js',
    'src/js/script.js'
  ],
  name: 'script.js',
};
gulp.task('compile:scripts', () => {  
  if (scripts.name instanceof Array) {
    let tasks = [], srcs = scripts.src, names = scripts.name;
    for (let i = 0; i < srcs.length; i++) {
      tasks.push(doJsConcat(names[i], srcs[i], 'assets/' + 'js'));
    }
    return mergeStream(tasks).pipe(browserSync.stream());
  } else if(typeof scripts.name === 'string') {
    doJsConcat(scripts.name, scripts.src, 'assets/' + 'js');
  }
}); 
gulp.task('watch:scripts', () => { gulp.watch(scripts.src, ['compile:scripts']); });

let svgSrc = 'src/svg';
let svgDest = 'assets/svg';
gulp.task('optimize:svgMin', () => { doSvgMin(svgSrc + '/*.svg', svgDest); });
gulp.task('optimize:svgSprites', () => { doSvgSprites(svgSrc + '/sprites/*.svg', svgDest); });
gulp.task('optimize:svg', ['optimize:svgMin', 'optimize:svgSprites']);
gulp.task('watch:svgmin', () => { gulp.watch(svgSrc + '/*.svg', ['optimize:svgMin']); });
gulp.task('watch:svgsprites', () => { gulp.watch(svgSrc + '/sprites/*.svg', ['optimize:svgSprites']); });
gulp.task('watch:svg', ['watch:svgmin', 'watch:svgsprites']);

gulp.task('build:move', () => {
  doMove([
    'bower_components/html5shiv/dist/html5shiv.js', 
    'bower_components/go-native/dist/go-native.ie8.min.js',
    'bower_components/tiny-slider/dist/min/tiny-slider.native.js'
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
gulp.task('watch:image', () => {
  gulp.watch([imageSrc], function (e) {
    var destPath = path.dirname(e.path).replace('src/', 'assets/');
    if (e.type === 'added' || e.type === 'changed') {
      doImageMin(e.path, destPath);
    } else if (e.type === 'renamed') {
      return gulp.src(e.path)
        .pipe(rename({basename: path.parse(e.path).name}))
        .pipe(gulp.dest(destPath));
    } else if (e.type === 'deleted') {
      return del(e.path.replace('src/', 'assets/'));
    }
  });
});

gulp.task('build:ampUncss', () => {
  doAmpUncss(cssDest + '/main.css', cssDest, {
      html: ['http://localhost:3000/article.html'],
      ignore: ['#sidebar', '#sidebar>ul>li>a', '.hasImgs li amp-img', '.hidden-svg'],
  });
});
gulp.task('build:ampInject', () => { doAmpInject('amp.html', cssDest + '/amp.css', '.'); });
gulp.task('build:amp', ['build:ampUncss', 'build:ampInject']);

gulp.task('server', () => { browserSync.init({ server: { baseDir: './'}, open: false, notify: false }); });

gulp.task('build', [
  // 'compile:markup',
  // 'compile:styles',
  // 'compile:scripts',
  // 'optimize:svg',
  // 'optimize:image',
  // 'build:move',
  // 'build:inject',
  // 'build:amp',
]);

gulp.task('watch', [
    'watch:markup',
    'watch:styles',
    'watch:scripts',
    'watch:svg',
    'watch:image',
  ], () => { gulp.watch(['**/*.html', 'assets/js/*.js']).on('change', browserSync.reload); });

// Default Task
gulp.task('default', [
  'build',
  'server', 
  'watch',
]);  







function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

function requireUncached( $module ) {
  delete require.cache[require.resolve( $module )];
  return require( $module );
}

function doNunjucks(data, src, dest) {
  data.year = new Date().getFullYear();
  data.getImageCount = () => { 
    if (imageCount === 'undefined') { let imageCount = 0; }
    return imageCount += 1; 
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
    treeshake: false,
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
      format: 'es',
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

