const gulp = require('gulp');
const gutil = require('gulp-util');
const bower = require('gulp-bower');
const watch = require('gulp-watch');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');

const watchify = require('watchify');
const browserify = require('browserify');
const runSequence = require('run-sequence');
const bs = require('browser-sync').create();
const source = require('vinyl-source-stream');

const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');

const csso = require('gulp-csso');
const less = require('gulp-less');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('gulp-autoprefixer');

// Browser-sync params
let bsParams = {
  server: './build',
  port: 8080,
  notify: false,
  logFileChanges: false
};

// Bundle function
let bundle = (bundler) => {
  return bundler
    .bundle()
    .on('error', (err) => gutil.log(err))
    .pipe(source('universe-god.js'))
    .pipe(gulp.dest('./build/scripts/'))
    .pipe(bs.stream());
};

// CSS sub-tasks
gulp.task('less-to-css', () => {
  return gulp.src('./src/styles/universe-god.less')
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('./build/styles/'));
});

gulp.task('less-format', () => {
  return gulp.src('./src/styles/**/*')
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('./src/styles/'));
});

gulp.task('css-min', () => {
  return gulp.src('./build/styles/universe-god.css')
    .pipe(csso())
    .pipe(rename('universe-god.min.css'))
    .pipe(gulp.dest('./build/styles/'));
});

// JS sub-tasks
gulp.task('eslint', () => {
  return gulp.src('./src/scripts/**/*')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('js-min', () => {
  return gulp.src('./build/scripts/universe-god.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(rename('universe-god.min.js'))
    .pipe(gulp.dest('./build/scripts/'));
});

// Bower install
gulp.task('bower', () => {
  // Looking for a better way to do it, like bower-installer: don't include full repo
  return bower('./bower_components')
    .pipe(plumber())
    .pipe(gulp.dest('./build/components/'));
});

// Copy files
gulp.task('copy-semantic', () => {
  return gulp.src('./semantic/packaged/**/*', { base: './semantic/packaged/' })
    .pipe(gulp.dest('./build/components/semantic/'));
});

gulp.task('copy-index', () => {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./build/'));
});

gulp.task('copy-images', () => {
  return gulp.src(['./src/images/**/*', '!src/images/favicon.ico'])
    .pipe(gulp.dest('./build/images/'));
});

gulp.task('copy-favicon', () => {
  return gulp.src('./src/images/favicon.ico')
    .pipe(gulp.dest('./build/'));
});

// Global tasks
gulp.task('watch', () => {
  let watcher = watchify(browserify('./src/scripts/index.js'), watchify.args);

  bundle(watcher);

  watch(['./src/styles/**/*', './src/index.html'], () => {
    runSequence('watcher-build', () => {
      bundle(watcher);
    });
  });

  watcher.on('update', () => {
    runSequence('watcher-build', () => {
      bundle(watcher);
    });
  }).on('log', gutil.log);

  bs.init(bsParams);
});

gulp.task('browserify', () => {
  return bundle(browserify('./src/scripts/index.js'));
});

// Public tasks
gulp.task('default', ['watch']);

gulp.task('prod', ['less-format', 'css-min', 'js-min']);

gulp.task('build', () => {
  runSequence('bower');
  runSequence('copy-semantic', 'copy-index', 'copy-images', 'copy-favicon');
  runSequence('less-to-css', 'less-format');
  runSequence('eslint', () => {
    runSequence('browserify');
  });
});

gulp.task('watcher-build', () => {
  runSequence('copy-index', 'copy-images');
  runSequence('less-to-css');
  runSequence('eslint');
});
