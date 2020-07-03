const gulp = require('gulp');

const del = require('del');

const imagemin = require('gulp-imagemin');

const imageminJpegRecompress = require('imagemin-jpeg-recompress');

const runSequence = require('gulp4-run-sequence');

/**
 * Clean
 */
gulp.task('clean', function (done) {
    del.sync([
        './Distribution/**/*',
    ],
        {
            dot: true
        });
    done();
});

/**
 * Copy html files
 */
gulp.task('copy:html', function (done) {
    /**
     * Popup area
     */
    gulp.src([
        './Source/Popup/index.html'
    ])
    .pipe(gulp.dest('./Distribution/Popup/'));
    /**
     * Dashboard area
     */
    gulp.src([
        './Source/Dashboard/index.html'
    ])
    .pipe(gulp.dest('./Distribution/Dashboard/'));
    /**
     * Dashboard area
     */
    gulp.src([
        './Source/Dashboard/index.html'
    ])
    .pipe(gulp.dest('./Distribution/Dashboard/'));
    /**
     * Iframes
     */
    gulp.src([
        './Source/Iframes/index.html'
    ])
    .pipe(gulp.dest('./Distribution/Iframes/'));
    done();
});

/**
 * Copy background script
 */
gulp.task('copy:background', function (done) {
    gulp.src([
        './Source/Background/background.js'
    ])
        .pipe(gulp.dest('./Distribution/Background/'));
    done();
});

/**
 * Copy content script
 */
gulp.task('copy:content', function (done) {
    gulp.src([
        './Source/Content/content.js'
    ])
        .pipe(gulp.dest('./Distribution/Content/'));
    done();
});

gulp.task('compress:images', function () {
    return gulp.src('Source/Images/*.{png,jpg,jpeg,gif,ico}')
        .pipe(imagemin( 
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest('Distribution/Images'))
});

gulp.task('compile', function (callback) {
    runSequence(
        [
            'clean',
            'copy:html',
            'copy:background',
            'copy:content',
            'compress:images'
        ],
        callback);
});