// *** Run the commands below  in Terminal
// cd your/project/directory/
// npm init 
// npm install gulp gulp-svgmin gulp-svgstore gulp-imagemin


var gulp = require('gulp'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    imagemin = require('gulp-imagemin');

// *** svg task *** //
// Svg min
gulp.task('svg-min', function() {
  return gulp
  .src('dev/svg/*.svg')
  .pipe(svgmin({
    plugins: [{
      removeDoctype: true
    }],
    js2svg: {
      pretty: true
    }
  }))
  .pipe(gulp.dest('assets/svg-min'));
});

// Svg store
gulp.task('svgstore', function () {
  return gulp
  .src('dev/svg-sprite/*.svg')
  .pipe(svgmin({
    js2svg: {
    pretty: true
    }
  }))
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(gulp.dest('assets/svg-sprite'));
});

// *** image task *** //
gulp.task('image', function () {
  gulp
  .src('assets/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('assets/img/'));
});

gulp.task('default', ['svg-min', 'svgstore', 'image']);
