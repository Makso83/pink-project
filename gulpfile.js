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
      baseDir: './app',
    },
  });
  callback();
});

gulp.task('html', () => gulp.src('./app/html/*.html')
  .pipe(fileinclude({
    prefix: '@@',
  }))
  .pipe(gulp.dest('./app/')));

gulp.task('scss', () => gulp.src('./app/scss/*.scss')
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(autoprefixer({
    overrideBrowserslist: ['>0%'],
  }))
  .pipe(sourcemap.write())
  .pipe(gulp.dest('./app/css')));

gulp.task('watch', () => {
  watch(['./app/*.html', './app/css/*.css'], browserSync.reload);
  watch('./app/scss/*.scss', gulp.parallel('scss'));
  watch('./app/html/**/*.html', gulp.parallel('html'));
});

gulp.task('default', gulp.series('scss', 'html', gulp.parallel('server', 'watch')));
