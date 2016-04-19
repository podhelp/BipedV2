var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var jade = require('gulp-jade');
var gutil = require('gulp-util');

/* Gulp syntax
  gulp.task('task-name', function() {
  // Stuff Here
}); */

gulp.task('sass', function() {
 return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
  .pipe(sass())
  .pipe(autoprefixer('last 2 versions'))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({
   stream: true
  }))
});

/* gulp watch syntax
gulp.watch(''files-to-watch', ['tasks', 'to', 'run']); */

gulp.task('watch', ['browserSync', 'sass'], function() {
 gulp.watch('app/scss/**/*.scss', ['sass']);
 gulp.watch('app/*.html', browserSync.reload);
 gulp.watch('app/js/**/*.js', browserSync.reload);
 gulp.watch('app/jade/**/*.jade', ['jade']);
});

gulp.task('browserSync', function() {
 browserSync.init({
  server: {
   baseDir: 'app'
  },
 })
});

gulp.task('useref', function() {
 return gulp.src('app/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
 return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
   interlaced: true
  })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
 return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function() {
 return del.sync('dist');
});

gulp.task('cache:clear', function(callback) {
 return cache.clearAll(callback)
});

gulp.task('build', function(callback) {
 runSequence('clean:dist', ['sass', 'useref', 'images'], callback)
});

gulp.task('default', function(callback) {
 runSequence(['sass', 'jade', 'browserSync', 'watch'], callback)
});

gulp.task('jade', function() {
 return gulp.src('app/jade/**/*.jade')
  .pipe(jade({
   pretty: true
  }))
  .on('error', gutil.log)
  .pipe(gulp.dest('app'))
  .pipe(browserSync.reload({
   stream: true
  }))
});
