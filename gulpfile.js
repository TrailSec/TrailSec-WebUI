'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()

// CSS
const autoprefixer = require('gulp-autoprefixer')
const minifycss = require('gulp-clean-css')
const concat = require('gulp-concat')
const imagemin = require('gulp-imagemin')
const sass = require('gulp-sass')
// const clean = require('gulp-clean')
// const rename = require('gulp-rename')

// JAVASCRIPT
const eslint = require('gulp-eslint')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const globby = require('globby')
const through = require('through2')
const gutil = require('gulp-util')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const reactify = require('reactify')

const bases = {
  app: 'app/',
  dist: 'dist/'
}

const paths = {
  scripts: ['app/scripts/**/*.js', '!scripts/libs/**/*.js'],
  // libs:    ['scripts/libs/jquery/dist/jquery.js'],
  styles: ['app/sass/**/*.scss'],
  html: ['app//**/*.html'],
  images: ['app/images/**/*.png']
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
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(concat('style.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest(bases.dist))
    .pipe(browserSync.stream({match: paths.dist}))
})

gulp.task('lint', () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['**/*.js', '!node_modules/**'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
})

// Process scripts and concatenate them into one output file
// gulp.task('scripts', function () {
//   gulp.src(paths.scripts)
//     .pipe(concat('app.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest(bases.dist))
//     .pipe(browserSync.stream({match: paths.dist}))
// })

gulp.task('scripts', function () {
  // gulp expects tasks to return a stream, so we create one here.
  var bundledStream = through()

  bundledStream
    // turns the output bundle stream into a stream containing
    // the normal attributes gulp plugins expect.
    .pipe(source('app.min.js'))
    // the rest of the gulp task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add gulp plugins to the pipeline here.
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(bases.dist))

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby(paths.scripts).then(function (entries) {
    // create the Browserify instance.
    var b = browserify({
      entries: entries,
      debug: true,
      transform: [reactify]
    })

    // pipe the Browserify stream into the stream we created earlier
    // this starts our gulp pipeline.
    b.bundle().pipe(bundledStream)
  }).catch(function (err) {
    // ensure any errors from globby are handled
    bundledStream.emit('error', err)
  })

  // finally, we return the stream, so gulp knows when this task is done.
  return bundledStream
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
  gulp.watch(paths.scripts, ['scripts'])
  gulp.watch(paths.images, ['imagemin'])
})

gulp.task('serve', ['html', 'styles', 'lint', 'scripts', 'imagemin', 'watch'])
