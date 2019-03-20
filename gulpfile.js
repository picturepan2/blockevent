var gulp = require('gulp');
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var data = require('gulp-data');
var plumber = require('gulp-plumber');
var fs = require('fs');

var paths = {
  scss: './scss/*.scss',
  data: './data/*.yml',
  pug: './pug/!(_)*.pug',
  ics: './pug/ical/*.pug'
};

gulp.task('watch', function() {
  gulp.watch('./**/*.scss', ['build']);
  gulp.watch('./**/*.pug', ['web']);
  gulp.watch('./**/*.json', ['web', 'ics']);
  gulp.watch('./ical/*.pug', ['ics']);
});

gulp.task('build', function() {
  gulp.src(paths.scss)
    .pipe(sass({outputStyle: 'compact', precision: 10})
      .on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('./docs/assets/css'))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./docs/assets/css'));
});

gulp.task('web', function() {
  gulp.src(paths.pug)
    .pipe(plumber())
    .pipe(data(function(file) {
      return { require: require };
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./docs'));
});

gulp.task('ics', function() {
  gulp.src(paths.ics)
    .pipe(plumber())
    .pipe(data(function(file) {
      return { require: require };
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename({
      extname: ".ics"
    }))
    .pipe(gulp.dest('./docs/ical'));
});

gulp.task('default', ['build', 'web', 'ics']);
