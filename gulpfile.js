var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var babel = require('gulp-babel');
const {watch} = require('gulp');

var jsFiles = ['js/src/helper.js','js/src/modal.js','js/src/gallery.js']


gulp.task('sass',function(){
    return gulp.src('sass/gallery.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'))
});

gulp.task('build-js',function(){
    return gulp.src(jsFiles)
    .pipe(concat('gallery.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/build/'))
});

gulp.task('babel',function(){
    return gulp.src('js/build/gallery.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('js/final_babel/'))
});

gulp.task('default',gulp.parallel('sass','build-js'));

gulp.task('watch',function(){
    gulp.watch('sass/*.scss',gulp.series('sass'));
    gulp.watch('js/src/*.js',gulp.series('build-js'));
});