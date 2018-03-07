/**
 * 起服务、编译es6文件
 * gulp 任务名称 --gulpfile gulp_dev.js
 * gulp 任务名称 --gulpfile ./gulp_dev.js
 */

var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');

var taskPaths = require('./tasks/paths');


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
    filePath = filePath.substring(filePath.indexOf('%' + 'src' + '%'));
    filePath = '.' + filePath.replace(/%/img, '/');

    destPath = filePath.replace(eval('/(' + fileName + ')$/mg'), '');
    destPath = destPath.replace(eval('/\.\\/' + 'src' + '\\//'), ('./lib/'));

    return {
        filePath: filePath,
        destPath: destPath
    };
};


gulp.task('develop', function () {
    gulp.watch(taskPaths.node.src, function (file) {
        var paths = getSinglePath(file);

        gulp.src(paths.filePath)
            .pipe(babel())
            .pipe(gulp.dest(paths.destPath));
    });

    nodemon({
        script: "bin/www",
        ext: "js",
        ignore: ['./public', './node_modules', './src/**/*.js']
    }).on("restart", function () {
        console.log('restart');
    });
});