var gulp = require('gulp');
var gulpif = require('gulp-if');
var runSequence = require('run-sequence');
var argv = require("yargs").argv;
var clean = require('gulp-clean');
var path = require('path');
var nodemon = require('gulp-nodemon');
var RevAll = require('gulp-rev-all');
var uglify  = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var replace = require('gulp-replace');
var sass = require("gulp-sass");
var bower = require('gulp-bower');
var eslint =  require('gulp-eslint');

var taskPaths = require('./tasks/paths');

var jsonfile = require('jsonfile');
var imgHashFile = {};

var isDev = false;

var revOpts = {
    hashLength: 12,
    transformFilename: function (file, hash) {
        var ext = path.extname(file.path);
        if (ext.indexOf('scss') > 0) {
            ext = '.css';
        }
        if (isDev) {
            return path.basename(file.path, ext) + ext;
        } else {
            return hash.substr(0, 12) + ext;
        }
    }
};

gulp.task('default', function () {
    console.log('\n-------------- gulpfile task 说明 --------------\n')
    console.log('gulp build \n  打包静态资源，包括压缩、下载、编译 .scss、md5[限 NODE_ENV !== \'development\'] \n');
    console.log('gulp build -s \n  打包静态资源，包括压缩、下载、编译 .scss、md5[限 NODE_ENV !== \'dev\']，并启动服务[限 NODE_ENV == \'dev\'] \n');
    console.log('gulp develop \n  仅仅启动服务 \n');
    console.log('在开发环境下，也就是 NODE_ENV 为 dev 时，文件名称不进行重命名');
    console.log('\n-------------- end 说明 --------------\n');
});

gulp.task('bower', function() {
    return bower({directory: './' + STATIC_DIR + '/bower_components'});
});

gulp.task("clean", function () {
    return gulp.src(taskPaths.cleanSrc, {read: false})
        .pipe(clean());
});

var temmoGulp = {
    buildJs: function (src, dest, isWatching) {
        var opts = {
            fileNameManifest: 'js_hash.json',
            hashLength: revOpts.hashLength,
            transformFilename: revOpts.transformFilename
        };

        var revAll = new RevAll(opts);

        return gulp.src(src)
            .pipe(gulpif(!isDev, uglify()))
            .pipe(gulpif(!isWatching, revAll.revision()))
            .pipe(gulp.dest(dest))
            .pipe(gulpif(!isWatching, revAll.manifestFile()))
            .pipe(gulpif(!isWatching, gulp.dest('./hash')));
    },
    buildImg: function (src, dest, isWatching) {
        var opts = {
            fileNameManifest: 'img_hash.json',
            hashLength: revOpts.hashLength,
            transformFilename: revOpts.transformFilename
        };
        var revAll = new RevAll(opts);

        return gulp.src(src)
            .pipe(gulpif(!isWatching, revAll.revision()))
            .pipe(gulp.dest(dest))
            .pipe(gulpif(!isWatching, revAll.manifestFile()))
            .pipe(gulpif(!isWatching, gulp.dest('./hash')));
    },
    buildCss: function (src, dest, isWatching) {
        var opts = {
            fileNameManifest: 'css_hash.json',
            hashLength: revOpts.hashLength,
            transformFilename: revOpts.transformFilename
        };
        var revAll = new RevAll(opts);
        var compassImporter = function(url, prev, done) {
            if (!/^compass/.test(url))
                return done({file: url});
            done({file: 'compass-mixins/lib/' + url});
        };
        return gulp.src(src)
            .pipe(sass({
                outputStyle: "compressed",
                importer: compassImporter,
                includePaths: [ 'node_modules'],
                data: '@import "compass"; .transition { @include transition(all); }'
            }))
            .pipe(sass().on('error', sass.logError))
            .pipe(cssmin())
            .pipe(replace(/(\.\.\/){1,}img/mg, '/static/img'))
            .pipe(replace(/(\/.*?(jpg|jpeg|gif|png|bmp){1})/mg, function ($1) {
                var img = $1;

                try {
                    imgHashFile = jsonfile.readFileSync('./hash/img_hash.json');
                } catch (e) {
                    imgHashFile = {};
                }

                for (var key in imgHashFile) {
                    if (('/' + key) === $1) {
                        img = 'assets/' + imgHashFile[key];
                        break;
                    }
                }

                return img;
            }))
            .pipe(gulpif(!isWatching, revAll.revision()))
            .pipe(gulp.dest(dest))
            .pipe(gulpif(!isWatching, revAll.manifestFile()))
            .pipe(gulpif(!isWatching, gulp.dest('./hash')));
    }
};


var build = function () {
    var start = argv.s === true;

    gulp.task("js", function () {
        return temmoGulp.buildJs(taskPaths.js.src, taskPaths.js.dest, false);
    });

    gulp.task("img", function () {
        return temmoGulp.buildImg(taskPaths.img.src, taskPaths.img.dest, false);
    });

    gulp.task('css', function () {
        return temmoGulp.buildCss(taskPaths.css.src, taskPaths.img.dest, false);
    });

    if (isDev) {
        runSequence('clean', 'bower', 'js', 'img', 'css', 'watch');

        if (start) {
            runSequence('clean', 'bower', 'js', 'img', 'css', 'watch', 'develop');
        }
    } else {
        runSequence('clean', 'bower', 'js', 'img', 'css');
    }
};

gulp.task('build', function () {
    return build();
});

var getFileName = function (str) {
    var reg = /[^\\\/]*[\\\/]+/g;
    str = str.replace(reg,'');

    return str;
};

var getSinglePath = function (file) {
    var filePath = file.path,
        destPath,
        fileName = getFileName(file.path);

    filePath = filePath.replace(/(\\|\/)/img, '%');
    filePath = filePath.substring(filePath.indexOf('%' + STATIC_DIR + '%'));
    filePath = '.' + filePath.replace(/%/img, '/');

    destPath = filePath.replace(eval('/(' + fileName + ')$/mg'), '');
    destPath = destPath.replace(eval('/\.\\/' + STATIC_DIR + '\\//'), ('./' + STATIC_DIR + '/' + STATIC_FILES_OUTPUT + '/'));

    return {
        filePath: filePath,
        destPath: destPath
    };
};


gulp.task('watch', function () {
    gulp.watch(taskPaths.css.src, function (file) {
        var paths = getSinglePath(file);

        gulp.task('watchCss', function () {
            return temmoGulp.buildCss(paths.filePath, paths.destPath, true);
        });

        runSequence('watchCss');
    });

    gulp.watch(taskPaths.js.src, function (file) {
        var paths = getSinglePath(file);

        gulp.task('watchJs', function () {
            return temmoGulp.buildJs(paths.filePath, paths.destPath, true);
        });

        runSequence('watchJs');
    });

    gulp.watch(taskPaths.img.src, function(file) {
        var paths = getSinglePath(file);

        gulp.task('watchImg', function () {
            return temmoGulp.buildImg(paths.filePath, paths.destPath, true);
        });

        runSequence('watchImg');
    });
});


gulp.task('eslint_node', function () {
    return gulp.src(taskPaths.node.src)
        .pipe(eslint({
            useEslintrc: './node.eslintrc'
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('test', function () {
    runSequence('eslint_node')
});

gulp.task("develop", function () {
    nodemon({
        script: "bin/www",
        ext: "js",
        ignore: ['./public', './node_modules']
    }).on("restart", function () {
        console.log('restart');
    });
});
