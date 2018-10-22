'use strict';

const gulp = require('gulp');
const tslint = require('gulp-tslint');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('lint', () => {
  return gulp.src('src/**/*.ts').pipe(tslint({}))
    .pipe(tslint.report({
      summarizeFailureOutput: true
    }));
});

gulp.task('clean', () => {
  return gulp.src('build/*', {
    read: false
  })
    .pipe(clean());
});

gulp.task('build', () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('build'));
});
