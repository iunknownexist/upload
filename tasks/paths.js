/**
 * gulp.src 地址
 * gulp.dest 地址
 */

var commonSrc = './public/**/*';
var widgetSrc = '!./public/widget/**/*.*';
var bowerSrc = '!./public/bower_components/**/*.*';
var fileOutput = '!./public/assets/**/*.*';
var nodeModulesSrc = '!./public/node_modules/**/*.*';
var nodeModulesEtcSrc = '!./public/etc/**/*.*';
var commonDest = './public/assets';
var es5js = './controls/**/*.js';


module.exports = {
    frontend: {
        src: [
            commonSrc + '.js',
            widgetSrc,
            bowerSrc,
            nodeModulesSrc,
            nodeModulesEtcSrc,
            fileOutput
        ],
        dest: commonDest
    },
    node: {
        src: [ './src/**/*.js' ]
    },
    img: {
        src: [
            commonSrc + '.png',
            commonSrc + '.jpg',
            commonSrc + '.jpeg',
            commonSrc + '.gif',
            commonSrc + '.bmp',
            widgetSrc,
            bowerSrc,
            nodeModulesSrc,
            nodeModulesEtcSrc,
            fileOutput
        ],
        dest: commonDest
    },
    css: {
        src: [
            commonSrc + '.css',
            commonSrc + '.scss',
            widgetSrc,
            bowerSrc,
            nodeModulesSrc,
            nodeModulesEtcSrc,
            fileOutput
        ],
        dest: commonDest
    },
    cleanSrc: [
        './hash',
        commonDest
    ]
};
