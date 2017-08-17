// TODO: use Gulp 4.0.0 with gulp.series and gulp.parallel instead of run-sequence
// TODO: add prod task before deploy
var chalkrainbow = require('chalk-rainbow');

var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var ghpages = require('gulp-gh-pages');

var less = require('gulp-less');
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');

var watchify = require('watchify');
var babelify = require('babelify');
var browserify = require('browserify');

var htmlreplace = require('gulp-html-replace');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var runseq = require('run-sequence');
var bs = require('browser-sync').create();

// Script tasks
gulp.task('browserify', () => {
  return bundle();
});

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js', '!build/**', '!semantic/**', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('uglify-js', () => {
  return gulp.src('./build/scripts/bundle.js')
    .pipe(uglify())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('./build/scripts/'));
});

// Styles tasks
gulp.task('semantic-font', () => {
  // TODO: find a better and cleaner way to change semantic font path to /semantic base
  return gulp.src('./semantic/dist/themes/default/assets/fonts/**')
    .pipe(gulp.dest('./build/themes/default/assets/fonts/'));
});

gulp.task('less', () => {
  return gulp.src('./src/index.less')
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('./build/styles/'));
});

gulp.task('uglify-css', () => {
  return gulp.src('./build/styles/bundle.css')
    .pipe(cleancss())
    .pipe(rename('bundle.min.css'))
    .pipe(gulp.dest('./build/styles/'));
});

// HTML templating
gulp.task('html', () => {
  gulp.src(['./src/index.html', './src/assets/favicon.ico'])
    .pipe(gulp.dest('./build/'));

  return gulp.src('./src/assets/images/*.*')
    .pipe(gulp.dest('./build/assets/'));
});

gulp.task('html-dev', () => {
  return gulp.src('./build/index.html')
    .pipe(htmlreplace({
      js: 'scripts/bundle.js',
      css: 'styles/bundle.css'
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('html-prod', () => {
  return gulp.src('./build/index.html')
    .pipe(htmlreplace({
      js: 'scripts/bundle.min.js',
      css: 'styles/bundle.min.css'
    }))
    .pipe(gulp.dest('./build/'));
});

// Clean build folder
gulp.task('clean', () => {
  return gulp.src('build/**/*.*', { read: false })
    .pipe(clean());
});

// Browser-sync local server
gulp.task('server', () => {
  return bs.init({
    ui: { port: 8081 },
    port: 8080,
    server: './build',
    notify: false,
    logFileChanges: false
  });
});

// Deploy build/ to gulp-gh-pages
gulp.task('gh-pages', () => {
  return gulp.src('./build/**/*')
    .pipe(ghpages());
});

// Global tasks
gulp.task('build', () => {
  runseq(
    'clean',
    'lint',
    'browserify',
    'less',
    'semantic-font',
    'html',
    'html-dev', () => process.exit()
  );
});

gulp.task('prod', () => {
  runseq(
    'clean',
    'lint',
    'browserify',
    'uglify-js',
    'less',
    'uglify-css',
    'semantic-font',
    'html',
    'html-prod', () => {
      gutil.log(chalkrainbow('Ready to deploy!'));
      process.exit();
    }
  );
});

gulp.task('watch', () => {
  runseq(
    'clean',
    'lint',
    'browserify',
    'less',
    'semantic-font',
    'html',
    'html-dev',
    'server', () => {
      gulp.watch('./src/index.html', () => {
        runseq('html', 'html-dev', () => bs.reload());
      });

      gulp.watch('./src/styles/**/*.less', () => {
        runseq('less', () => bs.reload());
      });
    }
  );
});

gulp.task('deploy', () => {
  runseq(
    'gh-pages', () => {
      gutil.log(chalkrainbow('gh-pages deploy successfull!'));
      process.exit();
    }
  );
});

gulp.task('default', ['watch']);

// Browserify bundle stuff
var b = watchify(browserify('./src/index.js')).transform(babelify, { presets: ['es2015'] });
b.on('log', gutil.log).on('update', () => {
  runseq('lint', 'browserify', () => bs.reload());
});

function bundle() {
  return b.bundle()
    .on('error', (err) => gutil.log(gutil.colors.red('Error while building scripts:\n'), err))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/scripts/'));
}
