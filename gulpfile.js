const gulp = require('gulp');
const browserSync = require('browser-sync');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemap = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');

gulp.task('server', (callback) => {
  browserSync.init({
    server: {
      baseDir: './app/build',
    },
  });
  callback();
});

gulp.task('html', () => gulp.src('./app/src/html/**/*.html')
  .pipe(fileinclude({
    prefix: '@@',
  }))
  .pipe(gulp.dest('./app/build/')));

gulp.task('scss', () => gulp.src('./app/src/scss/*.scss')
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(autoprefixer({
    overrideBrowserslist: ['>0%'],
  }))
  .pipe(sourcemap.write())
  .pipe(gulp.dest('./app/build/css')));

gulp.task('watch', () => {
  watch(['./app/build/**/*.html', './app/build/css/**/*.css'], browserSync.reload);
  watch('./app/src/scss/*.scss', gulp.parallel('scss'));
  watch('./app/src/html/**/*.html', gulp.parallel('html'));
});

gulp.task('default', gulp.series('scss', 'html', gulp.parallel('server', 'watch')));
