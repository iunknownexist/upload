/**
 * 打包静态文件、跑单元测试
 * gulp 任务名称 --gulpfile gulp_build.js
 * gulp 任务名称 --gulpfile ./gulp_build.js
 */

var gulp = require('gulp');
var gulpif = require('gulp-if');
var runSequence = require('run-sequence');
var argv = require('yargs').argv;
var clean = require('gulp-clean');
var path = require('path');
var RevAll = require('gulp-rev-all-fixed');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var bower = require('gulp-bower');

var taskPaths = require('./tasks/paths');
var jsonfile = require('jsonfile');
var imgHashFile = {};


function getRevOpts(isDev) {
    var opt = {
        hashLength: 12,
        transformFilename: function (file, hash) {
            var ext = path.extname(file.path);
            var suffixes = isDev ? '' : '.' + hash.substr(0, 6);

            if (ext.indexOf('scss') > 0) {
                ext = '.css';
            }

            return path.basename(file.path, ext) + suffixes + ext;
        }
    };

    return opt;
}

gulp.task('bower', function() {
    return bower({ directory: './public/bower_components' });
});

gulp.task('clean', function () {
    return gulp.src(taskPaths.cleanSrc, { read: false })
        .pipe(clean());
});

var temmoGulp = {
    buildJs: function (src, dest, isDev, isWatching) {
        var opts = {
            fileNameManifest: 'js_hash.json',
            hashLength: getRevOpts(isDev).hashLength,
            transformFilename: getRevOpts(isDev).transformFilename
        };
        var revAll = new RevAll(opts);

        return gulp.src(src)
            .pipe(uglify())
            .pipe(revAll.revision())
            .pipe(gulp.dest(dest))
            .pipe(revAll.manifestFile())
            .pipe(gulpif(!isWatching, gulp.dest('./hash')));

    },
    buildImg: function (src, dest, isDev, isWatching) {
        var opts = {
            fileNameManifest: 'img_hash.json',
            hashLength: getRevOpts(isDev).hashLength,
            transformFilename: getRevOpts(isDev).transformFilename
        };
        var revAll = new RevAll(opts);

        return gulp.src(src)
            .pipe(revAll.revision())
            .pipe(gulp.dest(dest))
            .pipe(revAll.manifestFile())
            .pipe(gulpif(!isWatching, gulp.dest('./hash')));
    },
    buildCss: function (src, dest, isDev, isWatching) {
        var opts = {
            fileNameManifest: 'css_hash.json',
            hashLength: getRevOpts(isDev).hashLength,
            transformFilename: getRevOpts(isDev).transformFilename
        };
        var revAll = new RevAll(opts);
        var compassImporter = function(url, prev, done) {
            if (!/^compass/.test(url)) {
                return done({ file: url });
            }

            done({ file: 'compass-mixins/lib/' + url });
        };

        return gulp.src(src)
            .pipe(sass({
                outputStyle: 'compressed',
                importer: compassImporter,
                includePaths: [ 'node_modules' ],
                data: '@import "compass"; .transition { @include transition(all); }'
            }))
            .pipe(sass().on('error', sass.logError))
            .pipe(cssmin())
            .pipe(replace(/(\.\.\/.*?(jpg|jpeg|gif|png|bmp){1})/mg, function ($1) {
                var img = $1;
                // ../../
                var imgRal = img.replace(/((\.\.\/){1,})(.*?(jpg|jpeg|gif|png|bmp){1})/g, '$1');
                //  1.png
                var imgName = img.replace(/((\.\.\/){1,})(.*?(jpg|jpeg|gif|png|bmp){1})/g, '$3');

                img = '../' + img;

                try {
                    imgHashFile = jsonfile.readFileSync('./hash/img_hash.json');
                } catch (e) {
                    imgHashFile = {};
                }

                for (var key in imgHashFile) {

                    if (key === imgName) {
                        img = imgRal + imgHashFile[key];
                        break;
                    }
                }

                return img;
            }))
            .pipe(revAll.revision())
            .pipe(gulp.dest(dest))
            .pipe(revAll.manifestFile())
            .pipe(gulpif(!isWatching, gulp.dest('./hash')));
    }
};


var build = function () {
    // 是否监听
    var isDev = argv.dev === true;

    gulp.task('js', function () {
        return temmoGulp.buildJs(taskPaths.frontend.src, taskPaths.frontend.dest, isDev);
    });

    gulp.task('img', function () {
        return temmoGulp.buildImg(taskPaths.img.src, taskPaths.img.dest, isDev);
    });

    gulp.task('css', function () {
        return temmoGulp.buildCss(taskPaths.css.src, taskPaths.img.dest, isDev);
    });

    runSequence('clean', 'bower', 'js', 'img', 'css');
};

gulp.task('build', function () {
    return build();
});

var getFileName = function (str) {
    var reg = /[^\\\/]*[\\\/]+/g;
    str = str.replace(reg, '');

    return str;
};

var getSinglePath = function (file) {
    var filePath = file.path,
        destPath,
        fileName = getFileName(file.path);

    filePath = filePath.replace(/(\\|\/)/img, '%');
    filePath = filePath.substring(filePath.indexOf('%public%'));
    filePath = '.' + filePath.replace(/%/img, '/');

    destPath = filePath.replace(eval('/(' + fileName + ')$/mg'), '');
    destPath = destPath.replace(eval('/\.\\/public\\//'), ('./public/assets/'));

    return {
        filePath: filePath,
        destPath: destPath
    };
};


gulp.task('watch', function () {
    gulp.watch(taskPaths.css.src, function (file) {
        var paths = getSinglePath(file);

        gulp.task('watchCss', function () {
            return temmoGulp.buildCss(paths.filePath, paths.destPath, true, true);
        });

        runSequence('watchCss');
    });

    gulp.watch(taskPaths.js.src, function (file) {
        var paths = getSinglePath(file);

        gulp.task('watchJs', function () {
            return temmoGulp.buildJs(paths.filePath, paths.destPath, true, true);
        });

        runSequence('watchJs');
    });
});
