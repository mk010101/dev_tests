const gulp = require('gulp');
const bsync = require('browser-sync').create();


gulp.task('b', function() {
    console.log(33)
    bsync.init({
        server: {
            baseDir: "./"
        }
    });
});