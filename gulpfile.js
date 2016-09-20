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
    "minify": true,
    "options": [
      "setClasses"
    ],
    "feature-detects": [
      "touchevents"
    ],
  },
  
  // styles
  sass: {
    src: 'src/scss/**/*.scss',
    dest: 'assets/css',
  },
  
  // scripts
  js: {
    src:[
      "bower_components/go-native/dist/go-native.js",
      "src/js/script.js"
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
    src: ['bower_components/html5shiv/dist/html5shiv.js', 'bower_components/go-native/dist/go-native.ie8.min.js'],
    dest: 'assets/js'
  },

  // inject
  inject: {
    dest: 'part',
    head: {
      css: 'assets/css/critical.css',
      loadcss: [
        'bower_components/loadcss/src/loadCSS.js', 
        'bower_components/loadcss/src/onloadCSS.js',
      ],
      svg4everybody: 'bower_components/svg4everybody/dist/svg4everybody.legacy.js',
      target: 'part/head.php',
    },
    svg: {
      src: 'src/svg/sprites/*.svg',
      dest: 'assets/svg/sprites',
      target: 'part/inline-svg.php',
      name: 'svg-sprites.svg',
    },
  },

  // svgs
  svg_min: {
    src: ['src/svg/**/*.svg', '!src/svg/sprites/*.svg', '!src/svg/fallback/*.svg'],
    dest: 'assets/svg'
  },
  svg_fallback: {
    src: 'src/svg/fallback/*.svg',
    dest: 'assets/svg/fallback',
    options: {
      width: 60,
      height: 60,
    }
  },

  // watch
  watch: {
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

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  
function fileContents (filePath, file) {
  return file.contents.toString();
}
function fileContentsScript(filePath, file) {
  return '<script>' + file.contents.toString() + '</script>';
}
function fileContentsScriptSvg4everybody(filePath, file) {
  return '<script>' + file.contents.toString().replace('height:100%;width:100%', '') + '</script>';
}
function fileContentsStyle(filePath, file) {
  return '<style>' + file.contents.toString() + '</style>';
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

// move
gulp.task('move', function () {
  return gulp.src(config.move.src)
      .pipe(gulp.dest(config.move.dest));
});

// inject
gulp.task('inject_svgsprites', function () {
  var svgSprites = gulp.src(config.inject.svg.src)
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
      // colorize: remove vector-effect
      .pipe(colorize({
        colors: { default: { black: '#000' } },
        replaceColor: function(content, hex) {
          return content.replace('vector-effect="non-scaling-stroke"', '');
        },
        replacePath: function(path, colorKey) {
          return path.replace(/\.svg/, '.svg');
        }
      }))
      .pipe(rename(config.inject.svg.name))
      .pipe(gulp.dest(config.inject.svg.dest));

  return gulp.src(config.inject.svg.target)
      .pipe(inject(svgSprites, {
        // starttag: config.svg_inject.starttag,
        transform: fileContents
      }))
      .pipe(gulp.dest(config.inject.dest));
});
gulp.task('inject_css', function () {
  var critical = gulp.src(config.inject.head.css);

  return gulp.src(config.inject.head.target)
      .pipe(inject(critical, {
        name: 'critical',
        transform: fileContentsStyle
      }))
      .pipe(gulp.dest(config.inject.dest));
});
gulp.task('inject', ['inject_svgsprites'], function () {
  var loadcss = gulp.src(config.inject.head.loadcss)
      .pipe(concat('loadcss.js'))
      .pipe(uglify());

  var critical = gulp.src(config.inject.head.css);

  var svg4everybody = gulp.src(config.inject.head.svg4everybody)
      .pipe(uglify());

  var modernizrJs = gulp.src('src/js/*.js')
      .pipe(modernizr(config.modernizr_options))
      .pipe(uglify());

  return gulp.src(config.inject.head.target)
      .pipe(inject(loadcss, {
        name: 'loadcss',
        transform: fileContentsScript
      }))
      .pipe(inject(critical, {
        name: 'critical',
        transform: fileContentsStyle
      }))
      .pipe(inject(svg4everybody, {
        name: 'svg4everybody',
        transform: fileContentsScriptSvg4everybody
      }))
      .pipe(inject(modernizrJs, {
        name: 'modernizr',
        transform: fileContentsScript
      }))
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
  gulp.watch(config.sass.src, ['sass']);
  gulp.watch(config.js.src, ['js']);
  gulp.watch(config.svg_min.src, ['svgmin']);
  gulp.watch(config.inject.head.css, ['inject_css']);
  gulp.watch(config.inject.svg.src, ['inject_svgsprites']);
  gulp.watch(config.svg_fallback.src, ['svgfallback']);
  gulp.watch(config.watch.php).on('change', browserSync.reload);
  gulp.watch(config.watch.html).on('change', browserSync.reload);
})

// Default Task
gulp.task('default', [
  'sass', 
  'js', 
  'svgmin', 
  'move',
  'inject',
  'sync', 
  'watch',
]);  