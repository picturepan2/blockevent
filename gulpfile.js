var gulp = require('gulp');
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var csscomb = require('gulp-csscomb');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var data = require('gulp-data');
var plumber = require('gulp-plumber');
var yaml = require('gulp-yaml');
var fs = require('fs');

var paths = {
  scss: './scss/*.scss',
  data: './data/*.yml',
  pug: './pug/!(_)*.pug'
};

gulp.task('watch', function() {
  gulp.watch('./**/*.scss', ['build']);
  gulp.watch('./**/*.yml', ['data']);
  gulp.watch('./**/*.pug', ['web']);
  gulp.watch('./**/*.json', ['web']);
});

gulp.task('data', function() {
  gulp.src(paths.data)
    .pipe(yaml({schema: 'DEFAULT_SAFE_SCHEMA'}))
    .pipe(gulp.dest('./data/'))
});

gulp.task('build', function() {
  gulp.src(paths.scss)
    .pipe(sass({outputStyle: 'compact', precision: 10})
      .on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('./assets/css'))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets/css'));
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
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['build', 'data', 'web']);
