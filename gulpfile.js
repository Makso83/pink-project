const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemap = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webpHTML = require('gulp-webp-html');
const webpcss = require('gulp-webp-css');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const del = require('del');

const server = (callback) => {
  browserSync.init({
    server: {
      baseDir: './app/build',
    },
    notify: false,
  });
  callback();
};

const html = () => gulp.src('./app/src/html/*.html')
  .pipe(fileinclude({
    prefix: '@@',
  }))
  .pipe(webpHTML())
  .pipe(gulp.dest('./app/build/'))
  .pipe(browserSync.stream());

const images = () => gulp.src('./app/src/img/*.*')
  .pipe(webp({
    quality: 70,
  }))
  .pipe(gulp.dest('./app/build/img/'))
  .pipe(gulp.src('./app/src/img/*.*'))
  .pipe(imagemin())
  .pipe(gulp.dest('./app/build/img/'));

const scss = () => gulp.src('./app/src/scss/*.scss')
  .pipe(sass())
  .pipe(autoprefixer({
    overrideBrowserslist: ['>0%'],
  }))
  .pipe(webpcss())
  .pipe(csso())
  .pipe(gulp.dest('./app/build/css'))
  .pipe(browserSync.stream());

const fontsConvert = () => gulp.src('./app/src/fonts/*.ttf')
  .pipe(ttf2woff())
  .pipe(gulp.dest('./app/build/fonts/'))
  .pipe(gulp.src('./app/src/fonts/*.ttf'))
  .pipe(ttf2woff2())
  .pipe(gulp.dest('./app/build/fonts/'));

const clean = () => del('./app/build');

const watch = () => {
  // gulp.watch(['./app/build/**/*.html', './app/build/css/**/*.css'], browserSync.stream);
  gulp.watch('./app/src/scss/*.scss', gulp.parallel(scss));
  gulp.watch('./app/src/html/**/*.html', gulp.parallel(html));
};

const startDev = gulp.series(clean, images, html, scss, fontsConvert, gulp.parallel(server, watch));

exports.fonts = fontsConvert;
exports.default = (startDev);
