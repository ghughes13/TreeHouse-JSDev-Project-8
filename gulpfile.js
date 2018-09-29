'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    image = require('gulp-image'),
    connect = require('gulp-connect');

/////////////////////////////
//JavaScript Related Tasks///
/////////////////////////////

//Concats JS files, maps and minifies;
gulp.task('concat', () => {
  return gulp.src([
    'js/circle/autogrow.js',
    'js/circle/circle.js'])
  .pipe(maps.init())
  .pipe(concat("global.js"))
  .pipe(uglify())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('js'));
});

//Runs 'Concat' then coppies global.js to dist file as 'all.min.js';
gulp.task('scripts', ['concat'], () => {
  return gulp.src("js/global.js")
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
})

/////////////////////////////
////CSS/SASS Related Tasks///
/////////////////////////////

//Compiles SASS changes, Maps the Css, and minifies it;
gulp.task('sasscompile', () => {
  return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(uglifycss())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));
});

//Watches for changes in and sass files and runs sasscompile for changes
gulp.task('watchsass', () => {
  gulp.watch(['sass/**/*.sass', 'sass/**/*.scss'], ['sasscompile'])
});

//Compiles SASS, midifies CSS, and copies global.css to dist file
gulp.task('styles', ['sasscompile'], () => {
  return gulp.src('css/global.css')
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/styles'));
})

/////////////////////////////
////Picture Related Tasks////
/////////////////////////////

//Optimizes images and icons and copies to dist colder
gulp.task('image', () => {
  return gulp.src(['images/*', 'icons/*', 'icons/svg/*'], {base : './'})
    .pipe(image())
    .pipe(gulp.dest('dist/content'));
});

/////////////////////////////
/////Build Related Tasks/////
/////////////////////////////

//Deletes all Dist subdirectories
gulp.task('clean', () => {
  del(['dist/content', 'dist/scripts', 'dist/styles']);
});

//Runs Scripts, styles, and images
gulp.task('build', ['scripts', 'styles', 'image'], () => {
  gulp.src('index.html')
    .pipe(gulp.dest('dist'))
});

//starts server for site on port 3000
gulp.task('connect', ['build'], () => {
  return connect.server({
    root: 'dist',
    livereload: true,
    port: 3000
  });
});

//cleans the dist folder then pulls all needed files back into it
gulp.task('default', ['clean'], () => {
  gulp.start('connect');
});
