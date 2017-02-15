'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()

// CSS
const autoprefixer = require('gulp-autoprefixer')
const minifycss = require('gulp-clean-css')
const concat = require('gulp-concat')
const imagemin = require('gulp-imagemin')
const sass = require('gulp-sass')

// JAVASCRIPT
const eslint = require('gulp-eslint')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')

const bases = {
  app: 'app/',
  dist: 'dist/'
}

const paths = {
  app: 'app/js/app.js',
  scripts: ['app/js/**/*.js', '!js/libs/**/*.js'],
  styles: ['app/styles/**/*.scss', 'app/styles/**/*.sass', 'app/styles/**/*.css'],
  html: ['app/**/*.html'],
  images: ['app/images/*']
}

// Copy HTML file over to /dist
gulp.task('html', function () {
  gulp.src(paths.html)
    .pipe(gulp.dest(bases.dist))
    .pipe(browserSync.stream({match: paths.dist}))
})

// Process SCSS files and concatenate them into one output file
gulp.task('styles', function () {
  gulp.src(paths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(concat('style.min.css'))
    .pipe(minifycss())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(bases.dist))
    .pipe(browserSync.stream({match: paths.dist}))
})

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**', '!**/vue.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('scripts_dev', function () {
  // app.js is your main JS file with all your module inclusions
  return browserify({entries: paths.app, debug: false})
      // .transform(babelify, { presets: ['es2015'] })
      .transform(babelify, {presets: ['es2015'], sourceMaps: false})
      .bundle()
      .pipe(source('app.min.js'))
      .pipe(gulp.dest(bases.dist))
})

gulp.task('scripts_prod', function () {
  // app.js is your main JS file with all your module inclusions
  return browserify({entries: paths.app, debug: false})
      .transform(babelify, {presets: ['es2015'], sourceMaps: true})
      .bundle()
      .pipe(source('app.min.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify({ compress: true }))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest(bases.dist))
})

// Imagemin images and ouput them in dist
gulp.task('imagemin', function () {
  gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(bases.dist + 'images/'))
    .pipe(browserSync.stream({match: paths.dist}))
})

gulp.task('watch', function () {
  browserSync.init({
    injectChanges: true,
    server: './dist/'
  })
  gulp.watch(paths.html, ['html'])
  gulp.watch(paths.styles, ['styles'])
  gulp.watch(paths.scripts, ['lint', 'scripts'])
  gulp.watch(paths.images, ['imagemin'])
})

gulp.task('serve', ['html', 'styles', 'lint', 'scripts_dev', 'imagemin', 'watch'])
gulp.task('build', ['html', 'styles', 'lint', 'scripts_prod', 'imagemin'])
