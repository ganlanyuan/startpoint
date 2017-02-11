const gulp = require('gulp');
const path = require('path');
const mergeStream = require('merge-stream');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const libsass = require('gulp-sass');
const rubysass = require('gulp-ruby-sass');
const sourcemaps = require('gulp-sourcemaps');
const modernizr = require('gulp-modernizr');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const inject = require('gulp-inject');
const uncss = require('gulp-uncss');
const nunjucks = require('gulp-nunjucks');
const htmltidy = require('gulp-htmltidy');

let sassLang = 'libsass';
let sourcemapDest = '../sourcemaps';
let PATHS = {
  src: 'src/',
  assets: 'assets/',
  templates: 'templates/'
};
let NAMES = {
  cssMain: 'main.css',
  cssAmp: 'amp.css',
  svgSprites: 'sprites.svg'
};
let moveFiles = [
  'bower_components/html5shiv/dist/html5shiv.js', 
  'bower_components/go-native/dist/go-native.ie8.min.js',
  'bower_components/tiny-slider/dist/min/tiny-slider.native.js'
];
let amp = {
  target: 'amp.html',
  src: 'assets/css/amp.css',
  uncss: {
    html: ['http://localhost:3000/article.php'],
    ignore: ['#sidebar', '#sidebar>ul>li>a', '.hasImgs li amp-img', '.hidden-svg'],
  }
};  
let svgMinSrc = ['src/svg/**/*.svg', '!src/svg/sprites/*.svg'];
let scripts = {
  src:[
    'bower_components/go-native/dist/go-native.js',
    'bower_components/sticky/dist/sticky.native.js',
    'src/js/script.js'
  ],
  name: 'script.js',
};

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  
function requireUncached( $module ) {
  delete require.cache[require.resolve( $module )];
  return require( $module );
}

// Nunjucks Task
gulp.task('nunjucks', function() {
  let data = requireUncached('./' + PATHS.templates + 'data.json');
  data.year = new Date().getFullYear();

  let imageCount = 0;
  data.getImageCount = function () { return imageCount += 1; };

  return gulp.src(PATHS.templates + '**/*.njk')
    .pipe(nunjucks.compile(data), {
      watch: true,
      noCache: true,
    })
    .pipe(rename(function (path) { path.extname = ".html"; }))
    .pipe(htmltidy({
      doctype: 'html5',
      wrap: 0,
      hideComments: true,
      indent: true,
      'indent-attributes': false,
      'drop-empty-elements': false,
      'force-output': true
    }))
    .pipe(gulp.dest('.'));
});

// Sass Task
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

// JS Task  
gulp.task('js', function () {  
  if (scripts.name instanceof Array) {
    let tasks = [], 
        srcs = scripts.src,
        names = scripts.name;
        
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

  } else if(typeof scripts.name === 'string') {
    return gulp.src(scripts.src)
        .pipe(sourcemaps.init())
        .pipe(concat(scripts.name))
        .pipe(uglify())
        .on('error', errorlog)  
        .pipe(sourcemaps.write(sourcemapDest))
        .pipe(gulp.dest(PATHS.assets + 'js'))
        .pipe(browserSync.stream());
  }
});  

// Move Task
gulp.task('move', function () {
  return gulp.src(moveFiles)
      .pipe(gulp.dest(PATHS.assets + 'js'));
});

// Svg Task
gulp.task('svgmin', function () {
  return gulp.src(svgMinSrc)
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
    .pipe(gulp.dest(PATHS.assets + 'svg'));
});

// Inject Task
gulp.task('inject', function () {
  let svg4everybody = gulp.src('bower_components/svg4everybody/dist/svg4everybody.legacy.min.js')
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

  return gulp.src(PATHS.templates + 'partials/layout.njk')
      .pipe(inject(svg4everybody, {
        starttag: '/* svg4everybody:js */',
        endtag: '/* endinject */',
        transform: function (filePath, file) {
          return file.contents.toString().replace('height:100%;width:100%', '');
        }
      }))
      // .pipe(inject(modernizrJs, {
      //   starttag: '/* modernizr:js */',
      //   endtag: /* endinject */,
      //   transform: function (filePath, file) {
      //     return file.contents.toString();
      //   }
      // }))
      .pipe(gulp.dest(PATHS.templates + 'partials'));
});

// Amp Task
gulp.task('amp-uncss', function () {
  return gulp.src(PATHS.assets + 'css/' + NAMES.cssMain)
    .pipe(uncss(amp.uncss))
    .pipe(rename(NAMES.cssAmp))
    .pipe(gulp.dest(PATHS.assets + 'css'));
})

gulp.task('amp', ['amp-uncss'], function () {
  return gulp.src(amp.target)
    .pipe(inject(gulp.src(PATHS.assets + 'svg/' + NAMES.svgSprites), {
      transform: function (filePath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(gulp.src(amp.src), {
      transform: function (filePath, file) {
        return '<style amp-custom>' + file.contents.toString().replace(/fonts\/mnr/g, 'assets/css/fonts/mnr').replace(/!important/g, '').replace('@page{margin:0.5cm}', '').replace(/"..\/img/g, '"assets/img') + '</style>';
      }
    }))
    .pipe(gulp.dest('.'));
})

// Server Task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    open: false,
    notify: false
  });
});

// Watch Task
gulp.task('watch', function () {
  gulp.watch([PATHS.templates + '**/*.njk', PATHS.templates + '*.json'], ['nunjucks']);
  gulp.watch(PATHS.src + 'scss/**/*.scss', ['sass']);
  gulp.watch(scripts.src, ['js']);
  gulp.watch(PATHS.src + 'svg/sprites/*.svg', ['svgsprites']);
  gulp.watch(svgMinSrc, ['svgmin']);
  gulp.watch('**/*.html').on('change', browserSync.reload);
});

// Default Task
gulp.task('default', [
  // 'nunjucks', 
  // 'sass', 
  // 'js', 
  // 'move',
  // 'svgmin', 
  // 'svgsprites',
  // 'inject',
  'browserSync', 
  'watch',
]);  