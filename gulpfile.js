var config = {
  sassLang: 'libsass',
  sourcemaps: '../sourcemaps',
  server: {
    base: '.',
    hostname: '0.0.0.0',
    keepalive: true,
    stdio: 'ignore',
  },
  browserSync: {
    proxy: '0.0.0.0:8000',
    open: true,
    notify: false
  },
  libsass_options: {
    outputStyle: 'compressed', 
    precision: 7
  },
  rubysass_options: {
    style: 'compressed', 
    precision: 7,
    'default-encoding': 'utf-8',
    sourcemap: true
  },
  modernizr_options: {
    'minify': true,
    'options': [
      'setClasses'
    ],
    'tests': [
      'touchevents'
    ],
  },
  
  // styles
  sass: {
    src: 'src/scss/*.scss',
    dest: 'assets/css',
  },
  
  // uncss
  uncss: {
    src: 'assets/css/main.css',
    amp: {
      options: {
        html: ['http://localhost:3000/article.php'],
        ignore: ['#sidebar', '#sidebar>ul>li>a', '.hasImgs li amp-img', '.hidden-svg'],
      },
      name: 'amp.css',
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
      },
      name: 'main.uncss.css',
    },
  },

  svg_amp: {
    src: 'assets/svg/sprites.svg'
  },

  amp: {
    target: 'amp.html',
    src: 'assets/css/amp.css',
    dest: '',
  },  

  // scripts
  js: {
    src:[
      'bower_components/go-native/dist/go-native.js',
      'bower_components/sticky/dist/sticky.native.js',
      'src/js/script.js'
    ],
    name: 'script.js',
    dest: 'assets/js',
    options: {
      // mangle: false,
      output: {
        quote_keys: true,
      },
      compress: {
        properties: false,
      }
    }
  },

  // move
  move: {
    src: [
      'bower_components/html5shiv/dist/html5shiv.js', 
      'bower_components/go-native/dist/go-native.ie8.min.js',
      'bower_components/tiny-slider/dist/min/tiny-slider.native.js'
    ],
    dest: 'assets/js'
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
  svg_sprites: {
    src: 'src/svg/sprites/*.svg',
    dest: 'assets/svg',
    name: 'sprites.svg',
  },
  svg_min: {
    src: ['src/svg/**/*.svg', '!src/svg/sprites/*.svg', '!src/svg/fallback/*.svg'],
    dest: 'assets/svg'
  },
  svg_fallback: {
    src: ['src/svg/fallback/*.svg'],
    dest: 'assets/svg/fallback',
    options: {
      width: 32,
      height: 32,
    }
  },

  // watch
  watch: {
    sass: 'src/scss/**/*.scss',
    php: '**/*.php',
    html: '**/*.html'
  },
};

var gulp = require('gulp');
var php = require('gulp-connect-php');
var libsass = require('gulp-sass');
var rubysass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var modernizr = require('gulp-modernizr');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var svgstore = require('gulp-svgstore');
var path = require('path');
var svgmin = require('gulp-svgmin');
var svg2png = require('gulp-svg2png');
var colorize = require('gulp-colorize-svgs');
var inject = require('gulp-inject');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
var mergeStream = require('merge-stream');
var uncss = require('gulp-uncss');

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

// SASS Task
if (config.sassLang === 'libsass') {
  gulp.task('sass', function () {  
    return gulp.src(config.sass.src)  
        .pipe(sourcemaps.init())
        .pipe(libsass(config.libsass_options).on('error', libsass.logError))  
        .pipe(sourcemaps.write(config.sourcemaps))
        .pipe(gulp.dest(config.sass.dest))
        .pipe(browserSync.stream());
  });  
} else {
  gulp.task('sass', function () {  
    return rubysass(config.sass.src, config.rubysass_options)  
        .pipe(sourcemaps.init())
        .on('error', rubysass.logError)  
        .pipe(sourcemaps.write(config.sourcemaps))
        .pipe(gulp.dest(config.sass.dest))
        .pipe(browserSync.stream());
  });  
}

// uncss
gulp.task('uncss-main', ['sass'], function () {
  return gulp.src(config.uncss.src)
    .pipe(uncss(config.uncss.main.options))
    .pipe(rename(config.uncss.main.name))
    .pipe(gulp.dest(config.sass.dest));
})

gulp.task('uncss-amp', function () {
  return gulp.src(config.uncss.src)
    .pipe(uncss(config.uncss.amp.options))
    .pipe(rename(config.uncss.amp.name))
    .pipe(gulp.dest(config.sass.dest));
})

gulp.task('svg-amp', function () {
  return gulp.src(config.amp.target)
    .pipe(inject(gulp.src(config.svg_amp.src), {
      transform: function (filePath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(gulp.dest(config.amp.dest));
})

gulp.task('amp', ['svg-amp', 'uncss-amp'], function () {
  return gulp.src(config.amp.target)
    .pipe(inject(gulp.src(config.amp.src), {
      transform: function (filePath, file) {
        return '<style amp-custom>' + file.contents.toString().replace(/fonts\/mnr/g, 'assets/css/fonts/mnr').replace(/!important/g, '').replace('@page{margin:0.5cm}', '').replace(/"..\/img/g, '"assets/img') + '</style>';
      }
    }))
    .pipe(gulp.dest(config.amp.dest));
})

// JS Task  
gulp.task('js', function () {  
  if (config.js.name instanceof Array) {
    var tasks = [], 
        srcs = config.js.src,
        names = config.js.name;
        
    for (var i = 0; i < srcs.length; i++) {
      tasks.push(
        gulp.src(srcs[i])
            .pipe(sourcemaps.init())
            .pipe(concat(names[i]))
            .pipe(uglify(config.js.options))
            .on('error', errorlog)  
            .pipe(sourcemaps.write(config.sourcemaps))
            .pipe(gulp.dest(config.js.dest))
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
        .pipe(sourcemaps.write(config.sourcemaps))
        .pipe(gulp.dest(config.js.dest))
        .pipe(browserSync.stream());
  }
});  

// move
gulp.task('move', function () {
  return gulp.src(config.move.src)
      .pipe(gulp.dest(config.move.dest));
});

// svg min
gulp.task('svgmin', function () {
  return gulp.src(config.svg_min.src)
      .pipe(svgmin())
      .pipe(gulp.dest(config.svg_min.dest))
});

// svg fallback
gulp.task('svgfallback', function () {
  return gulp.src(config.svg_fallback.src)
      .pipe(svg2png(config.svg_fallback.options))
      .pipe(imagemin())
      .pipe(gulp.dest(config.svg_fallback.dest))
});

gulp.task('svgsprites', function () {
  return gulp.src(config.svg_sprites.src)
    .pipe(svgmin(function (file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
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
    // // colorize: remove vector-effect
    // .pipe(colorize({
    //   colors: { default: { black: '#000' } },
    //   replaceColor: function(content, hex) {
    //     return content.replace('vector-effect="non-scaling-stroke"', '');
    //   },
    //   replacePath: function(path, colorKey) {
    //     return path.replace(/\.svg/, '.svg');
    //   }
    // }))
    .pipe(rename(config.svg_sprites.name))
    .pipe(gulp.dest(config.svg_sprites.dest));
});

// inject
gulp.task('inject', function () {
  var svg4everybody = gulp.src(config.inject.head.svg4everybody.src)
      .pipe(uglify());

  // var modernizrJs = gulp.src('src/js/*.js')
  //     .pipe(modernizr(config.modernizr_options))
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
gulp.task('server', function () {
  php.server(config.server);
});
gulp.task('sync', ['server'], function() {
  browserSync.init(config.browserSync);
});

// watch
gulp.task('watch', function () {
  gulp.watch(config.watch.sass, ['sass']);
  gulp.watch(config.js.src, ['js']);
  gulp.watch(config.svg_sprites.src, ['svgsprites']);
  gulp.watch(config.svg_min.src, ['svgmin']);
  gulp.watch(config.svg_fallback.src, ['svgfallback']);
  gulp.watch(config.watch.php).on('change', browserSync.reload);
  gulp.watch(config.watch.html).on('change', browserSync.reload);
})

// Default Task
gulp.task('default', [
  // 'sass', 
  // 'js', 
  // 'move',
  // 'svgmin', 
  // 'svgsprites',
  // 'inject',
  'sync', 
  'watch',
]);  