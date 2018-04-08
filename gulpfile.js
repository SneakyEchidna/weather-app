'use strict';

let gulp = require('gulp'),
  babelify = require('babelify'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  buffer = require('vinyl-buffer'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  cssmin = require('gulp-minify-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  rimraf = require('rimraf'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload;
let path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/app.js',
    style: 'src/style/main.scss',
    img: 'src/img/**/*.*',
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
  },
  clean: './build',
};
let config = {
  server: {
    baseDir: './build',
  },
  tunnel: true,
  host: 'localhost',
  port: 8080,
  logPrefix: 'Fozz',
};
gulp.task('html:build', function() {
  gulp
    .src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({ stream: true }));
});
gulp.task('js:build', function() {
  return browserify({
    entries: [path.src.js],
  })
    .transform(
      babelify.configure({
        presets: ['env'],
        sourceMaps: true,
      })
    )
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true }));
});
gulp.task('style:build', function() {
  gulp
    .src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({ stream: true }));
});
gulp.task('image:build', function() {
  gulp
    .src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
        interlaced: true,
      })
    )
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
});
gulp.task('build', ['html:build', 'js:build', 'style:build', 'image:build']);
gulp.task('watch', function() {
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
});
gulp.task('webserver', function() {
  browserSync(config);
});
gulp.task('clean', function(cb) {
  rimraf(path.clean, cb);
});
gulp.task('default', ['build', 'webserver', 'watch']);
