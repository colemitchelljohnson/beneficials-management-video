const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');

const paths = {
  sass: './src/scss/**/*.scss',
}

let env = 'dev';

gulp.task('sass', () => {
  return gulp.src(paths.sass)
    .pipe(sass({}))
    .pipe(gulp.dest('./src'))
})

gulp.task('default', ['sass']);

gulp.task('watch', ['sass'], () => {
  gulp.watch(paths.sass, ['sass']);
})
