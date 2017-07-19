const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');

const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
const bs = require('browser-sync').create();
const browserify = require('browserify');
const watchify = require('watchify');

const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');

const csso = require('gulp-csso');
const less = require('gulp-less');
const csscomb = require('gulp-csscomb');
const autoprefixer = require('gulp-autoprefixer');

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

// Global tasks
gulp.task('watch', () => {
  let watcher = watchify(browserify('./src/scripts/index.js'), watchify.args);

  bundle(watcher);

  watcher.on('update', () => {
    runSequence('less-to-css', 'eslint', () => {
      bundle(watcher);
    });
  });

  watcher.on('log', gutil.log);

  bs.init({
    server: './build',
    port: 8080,
    notify: false,
    logFileChanges: false
  });
});

// Public tasks
gulp.task('default', ['watch']);
gulp.task('prod', ['less-format', 'css-min', 'js-min']);
