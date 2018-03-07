var gulp = require('gulp');
var eslint = require('gulp-eslint');
var sassLint = require('gulp-sass-lint');
var runSequence = require('run-sequence');

var taskPaths = require('./tasks/paths');


// es6
gulp.task('node-lint', function () {
    return gulp.src(taskPaths.node.src)
        .pipe(eslint({
            env: {
                node: 1,
                browser: 0
            },
            rules: {
                'no-var': 0,
                'linebreak-style': 0
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

//
gulp.task('frontend-js-lint', function () {
    return gulp.src(taskPaths.frontend.src)
        .pipe(eslint({
            parserOptions: {
                ecmaVersion: 5
            },
            env: {
                node: 0,
                browser: 1
            },
            rules: {
                'no-var': 0,
                'linebreak-style': 0
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// css
gulp.task('css-lint', function () {
    return gulp.src(taskPaths.css.src)
        .pipe(sassLint({
            configFile: './.sass-lint.yml'
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});


gulp.task('test', function () {
    runSequence('node-lint', 'frontend-js-lint', 'css-lint');
});
