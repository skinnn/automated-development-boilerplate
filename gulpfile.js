const { src, dest, watch, task, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const assets = require('postcss-assets');
const filter = require('gulp-filter');
const del = require('del');
const browserSync = require('browser-sync');

// File path variables
const files = {
  js: {
    src: 'src/assets/js/**/*.js',
    dest: 'dist/assets/js'
  },
  scss: {
    src: 'src/sass/**/*.scss',
    dest: 'dist/assets/styles',
    compressSrc: 'src/assets/styles/**/*.css',
    compressDest: 'src/assets/styles',
  },
  html: {
    src: 'src/**/*.html',
    dest: 'dist'
  },
  images: {
    src: 'src/assets/images/**/*.{gif,png,jpg,jpeg,svg}',
    dest: 'dist/assets/images'
  },
  fonts: {
    src: 'src/assets/fonts/**/*',
    dest: 'dist/assets/fonts'
  },
  otherAssets: {
    src: 'src/assets/**/*',
    dest: 'dist/assets'
  }
}

// Delete dist folder
function cleanDist() {
  return del(['dist']);
}

// Clean src/assets/styles folder
function cleanCSS() {
  return del(['src/assets/styles/**']);
}

// Compress JS
function compressJS() {

  return pipeline(
    src(files.js.src),
    sourcemaps.init(),
      babel(),
      uglify(),
    sourcemaps.write('.'),
    dest(files.js.dest)
  );
}

// Compile SCSS
async function compileSCSS() {
  return src(files.scss.src)
    .pipe(sass({
      imagePath: '/images/',
    }).on('error', sass.logError))
    .pipe(postcss([
      assets({
        relative: true,
        basePath: 'src/',
        loadPaths: [
          'assets/images/'
        ]
      }),
      autoprefixer()
    ]))
    .pipe(dest(files.scss.compressDest))
    // Stream changes to all browsers
    .pipe(browserSync.stream());
}

// Compress CSS
function compressCSS() {
  return src(files.scss.compressSrc)
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(files.scss.dest));
}

// Compress HTML
function compressHTML() {
  const notAssets = filter(['**', '!*src/assets']);
  const notSass = filter(['**', '!*src/sass']);

  return src('src/**/*.html')
  .pipe(notAssets)
  .pipe(notSass)
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(dest('dist'));
}

// Compress images disabled (bad compression rate)
function compressImages() {
  return src(files.images.src)
    // .pipe(imagemin([
    //   imagemin.gifsicle({ interlaced: true }),
    //   imagemin.jpegtran({ progressive: false }),
    //   imagemin.optipng({ optimizationLevel: 5 }),
    //   imagemin.svgo({
    //     plugins: [
    //       { removeViewBox: true },
    //       { cleanupIDs: false }
    //     ]
    //   })
    // ]))
    .pipe(dest(files.images.dest))
    .on('end', () => console.log(`Image compression is disabled.`));
}

// Copy fonts to dist directory (without extension filter)
function copyFonts() {
  return src(files.fonts.src)
  .pipe(dest(files.fonts.dest))
}

// Copy other assets
function copyOtherAssets() {
  const filterFonts = filter(['**', '!*src/assets/fonts/**/*'], {restore: true});
  const filterImages = filter(['**', '!*src/assets/images/**/*'], {restore: true});
  const filterJs = filter(['**', '!*src/assets/js/**/*'], {restore: true});
  const filterStyles = filter(['**', '!*src/assets/styles/**/*'], {restore: true});

  return src(files.otherAssets.src)
  .pipe(filterFonts)
  .pipe(filterImages)
  .pipe(filterJs)
  .pipe(filterStyles)
  .pipe(dest(files.otherAssets.dest))
}


/*
*
* Watch tasks
*
*/

// Watch SASS task
function watchSass() {
  watch(files.scss.src, compileSCSS);
}

// Watch HTML task
function watchHTML() {
  watch(files.html.src).on('change', browserSync.reload);
}

// Watch JS task
function watchJS() {
  watch(files.js.src).on('change', browserSync.reload);
}

// Watch task (main)
function watchTask() {
  // Spin up the server
  browserSync.init({
    port: 3001,
    server: {
      baseDir: './src'
    },
    ui: {
      port: 3002
    }
  });

  // Listen for file changes
  watchSass();
  watchHTML();
  watchJS();
}

exports.watch = watchTask;

exports.sass = watchSass;

// Build task
exports.build = series(
  cleanDist,
  parallel(copyOtherAssets, compressHTML, compressJS, compressCSS, compressImages, copyFonts)
)