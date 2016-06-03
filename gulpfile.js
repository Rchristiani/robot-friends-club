'use strict'

const gulp = require('gulp');
const babel = require('gulp-babel');


gulp.task('js', () => {
	return gulp.src('./js/jsx/script.js')
		.pipe(babel({
			presets: ['es2015','react']
		}))
		.pipe(gulp.dest('./js/'));
});

gulp.task('default', ['js'], () => {
	gulp.watch('./js/jsx/script.js', ['js']);
});