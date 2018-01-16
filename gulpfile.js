'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const spritesmith = require('gulp.spritesmith');
const runSequence = require('run-sequence');
const exec = require('child_process').exec;
const fs = require('fs');
const pathUtil = require('path');
const spriter = require('gulp-css-spriter');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const htmlmin = require('gulp-html-minifier');


function getPathFiles(path, parse) {
  try {
    if (fs.statSync(path).isFile()) {
      parse(path)
    } else if (fs.statSync(path).isDirectory()) {
      let paths = fs.readdirSync(path);
      paths.forEach(function (p) {
        getPathFiles(pathUtil.join(path, p), parse);
      })
    }
  } catch (err) {
    console.log(path);
  }
}

// 编译sass
gulp.task('default', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(spriter({
      'spriteSheet': './publish/meepo-bmap.png',
      'pathToSpriteSheetFromCSS': './meepo-bmap.png'
    }))
    .pipe(concat('app.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./publish'));
});

// html mini
gulp.task('minify', function () {
  gulp.src('./src/app/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./src/.tmp'))
});

// 复制图片
gulp.task('copyPng', function () {
  getPathFiles('./src/app', (file) => {
    if (file.indexOf('.png') > -1) {
      exec('cp ' + file + ' themes/')
    }
  })
});
