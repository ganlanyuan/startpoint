const gulp = require('gulp');
const libsass = require('gulp-sass');
const rubysass = require('gulp-ruby-sass');
const sourcemaps = require('gulp-sourcemaps');
const modernizr = require('gulp-modernizr');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const svgstore = require('gulp-svgstore');
const path = require('path');
const svgmin = require('gulp-svgmin');
const inject = require('gulp-inject');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const mergeStream = require('merge-stream');
const uncss = require('gulp-uncss');

let sassLang = 'libsass';
let sourcemapDest = '../sourcemaps';
let PATHS = {
  src: 'src/',
  assets: 'assets/',
  templates: 'templates/'
};
let NAMES = {
  cssMain: 'main',
  cssAmp: 'amp',
  svgSprites: 'sprites'
};

const config = {
  // uncss
  uncss: {
    src: 'assets/css/main.css',
    amp: {
      options: {
        html: ['http://localhost:3000/article.php'],
        ignore: ['#sidebar', '#sidebar>ul>li>a', '.hasImgs li amp-img', '.hidden-svg'],
      }
    },
    main: {
      options: {
        html: [
          'http://localhost:3000/about.php',
          'http://localhost:3000/article.php',
          'http://localhost:3000/contact.php',
          'http://localhost:3000/index.php',
          'http://localhost:3000/permissions.php',
          'http://localhost:3000/privacy.php',
          'http://localhost:3000/search.php',
          'http://localhost:3000/section.php',
          'http://localhost:3000/terms.php',
        ],
        // ignore: ['#sidebar'],
      }
    },
  },

  svg_amp: {
    src: 'assets/svg/sprites.svg'
  },

  amp: {
    target: 'amp.html',
    src: 'assets/css/amp.css',
  },  

  // scripts
  js: {
    src:[
      'bower_components/go-native/dist/go-native.js',
      'bower_components/sticky/dist/sticky.native.js',
      'src/js/script.js'
    ],
    name: 'script.js',
  },

  // move
  move: {
    src: [
      'bower_components/html5shiv/dist/html5shiv.js', 
      'bower_components/go-native/dist/go-native.ie8.min.js',
      'bower_components/tiny-slider/dist/min/tiny-slider.native.js'
    ],
  },

  // inject
  inject: {
    dest: 'part',
    head: {
      svg4everybody: {
        src: 'bower_components/svg4everybody/dist/svg4everybody.legacy.min.js',
        starttag: '/* svg4everybody:js */',
        endtag: '/* endinject */'
      },
      modernizr: {
        starttag: '/* modernizr:js */',
        endtag: '/* endinject */'
      },
      target: 'part/head.php',
    },
  },

  // svgs
  svg_min: {
    src: ['src/svg/**/*.svg', '!src/svg/sprites/*.svg', '!src/svg/fallback/*.svg'],
  }
};

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

// SASS Task
if (sassLang === 'libsass') {
  gulp.task('sass', function () {  
    return gulp.src(PATHS.src + 'scss/*.scss')  
        .pipe(sourcemaps.init())
        .pipe(libsass({
          outputStyle: 'compressed', 
          precision: 7
        }).on('error', libsass.logError))  
        .pipe(sourcemaps.write(sourcemapDest))
        .pipe(gulp.dest(PATHS.assets + 'css'))
        .pipe(browserSync.stream());
  });  
} else {
  gulp.task('sass', function () {  
    return rubysass(PATHS.src + 'scss/*.scss', {
          style: 'compressed', 
          precision: 7,
          'default-encoding': 'utf-8',
          sourcemap: true
        })  
        .pipe(sourcemaps.init())
        .on('error', rubysass.logError)  
        .pipe(sourcemaps.write(sourcemapDest))
        .pipe(gulp.dest(PATHS.assets + 'css'))
        .pipe(browserSync.stream());
  });  
}

// uncss
gulp.task('uncss-main', ['sass'], function () {
  return gulp.src(PATHS.assets + 'css/' + NAMES.cssMain + '.css')
    .pipe(uncss(config.uncss.main.options))
    .pipe(rename(NAMES.cssMain + '.uncss.css'))
    .pipe(gulp.dest(PATHS.assets + 'css'));
})

gulp.task('uncss-amp', function () {
  return gulp.src(PATHS.assets + 'css/' + NAMES.cssMain + '.css')
    .pipe(uncss(config.uncss.amp.options))
    .pipe(rename(NAMES.cssAmp + '.css'))
    .pipe(gulp.dest(PATHS.assets + 'css'));
})

gulp.task('svg-amp', function () {
  return gulp.src(config.amp.target)
    .pipe(inject(gulp.src(config.svg_amp.src), {
      transform: function (filePath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(gulp.dest(''));
})

gulp.task('amp', ['svg-amp', 'uncss-amp'], function () {
  return gulp.src(config.amp.target)
    .pipe(inject(gulp.src(config.amp.src), {
      transform: function (filePath, file) {
        return '<style amp-custom>' + file.contents.toString().replace(/fonts\/mnr/g, 'assets/css/fonts/mnr').replace(/!important/g, '').replace('@page{margin:0.5cm}', '').replace(/"..\/img/g, '"assets/img') + '</style>';
      }
    }))
    .pipe(gulp.dest(''));
})

// JS Task  
gulp.task('js', function () {  
  if (config.js.name instanceof Array) {
    let tasks = [], 
        srcs = config.js.src,
        names = config.js.name;
        
    for (let i = 0; i < srcs.length; i++) {
      tasks.push(
        gulp.src(srcs[i])
            .pipe(sourcemaps.init())
            .pipe(concat(names[i]))
            .pipe(uglify({
              // mangle: false,
              output: {
                quote_keys: true,
              },
              compress: {
                properties: false,
              }
            }))
            .on('error', errorlog)  
            .pipe(sourcemaps.write(sourcemapDest))
            .pipe(gulp.dest(PATHS.assets + 'js'))
      );
    }

    return mergeStream(tasks)
        .pipe(browserSync.stream());

  } else if(typeof config.js.name === 'string') {
    return gulp.src(config.js.src)
        .pipe(sourcemaps.init())
        .pipe(concat(config.js.name))
        .pipe(uglify())
        .on('error', errorlog)  
        .pipe(sourcemaps.write(sourcemapDest))
        .pipe(gulp.dest(PATHS.assets + 'js'))
        .pipe(browserSync.stream());
  }
});  

// move
gulp.task('move', function () {
  return gulp.src(config.move.src)
      .pipe(gulp.dest(PATHS.assets + 'js'));
});

// svg min
gulp.task('svgmin', function () {
  return gulp.src(config.svg_min.src)
      .pipe(svgmin())
      .pipe(gulp.dest(PATHS.assets + 'svg'))
});

gulp.task('svgsprites', function () {
  return gulp.src(PATHS.src + 'svg/sprites/*.svg')
    .pipe(svgmin(function (file) {
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
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename(NAMES.svgSprites))
    .pipe(gulp.dest(PATHS.asssets + 'svg'));
});

// inject
gulp.task('inject', function () {
  let svg4everybody = gulp.src(config.inject.head.svg4everybody.src)
      .pipe(uglify());

  // let modernizrJs = gulp.src('src/js/*.js')
  //     .pipe(modernizr({
  //           'minify': true,
  //           'options': [
  //             'setClasses'
  //           ],
  //           'tests': [
  //             'touchevents'
  //           ],
  //         }))
  //     .pipe(uglify());

  return gulp.src(config.inject.head.target)
      .pipe(inject(svg4everybody, {
        starttag: config.inject.head.svg4everybody.starttag,
        endtag: config.inject.head.svg4everybody.endtag,
        transform: function (filePath, file) {
          return file.contents.toString().replace('height:100%;width:100%', '');
        }
      }))
      // .pipe(inject(modernizrJs, {
      //   starttag: config.inject.head.modernizr.starttag,
      //   endtag: config.inject.head.modernizr.endtag,
      //   transform: function (filePath, file) {
      //     return file.contents.toString();
      //   }
      // }))
      .pipe(gulp.dest(config.inject.dest));
});

// Server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    open: false,
    notify: false
  });
});

// watch
gulp.task('watch', function () {
  gulp.watch(PATHS.src + 'scss/**/*.scss', ['sass']);
  gulp.watch(config.js.src, ['js']);
  gulp.watch(PATHS.src + 'svg/sprites/*.svg', ['svgsprites']);
  gulp.watch(config.svg_min.src, ['svgmin']);
  gulp.watch('**/*.html').on('change', browserSync.reload);
});

// Default Task
gulp.task('default', [
  // 'sass', 
  // 'js', 
  // 'move',
  // 'svgmin', 
  // 'svgsprites',
  // 'inject',
  'browserSync', 
  'watch',
]);  