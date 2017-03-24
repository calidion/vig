'use strict';
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var coveralls = require('gulp-coveralls');
var tslint = require("gulp-tslint");
var del = require("del");


var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task('clean', function () {
    return del([
        // here we use a globbing pattern to match everything inside the `mobile` folder
        'dest/**/*'
    ]);
});

gulp.task("tsc", ['tslint'], function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            "module": "commonjs",
            "allowJs": true,
            "target": "es5",
            "noImplicitAny": true
        }))
        .pipe(gulp.dest('dest/src'));
});

gulp.task("tstestc", ['tsc'], function () {
    return gulp.src('tstest/**/*.test.ts')
        .pipe(ts({
            "module": "commonjs",
            "allowJs": true,
            "target": "es5",
            "noImplicitAny": true
        }))
        .pipe(gulp.dest('dest/tstest'));
});

gulp.task('pre-tstest', ['tstestc'], function () {
    return gulp.src('dest/src/**/*.js')
        .pipe(excludeGitignore())
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task("tstest", ['pre-tstest'], function () {
    var mochaErr;

    gulp.src('dest/tstest/**/*.test.js')
        .pipe(plumber())
        .pipe(mocha({
            reporter: 'spec'
        }))
        .on('error', function (err) {
            mochaErr = err;
            throw err;
        })
        .pipe(istanbul.writeReports())
        .on('end', function () {
            cb(mochaErr);
        });
});

gulp.task("tslint", ['clean'], () =>
    gulp.src(['src/**/*.ts', 'tstest/**/*.test.ts'])
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
);

gulp.task('static', function () {
    return gulp.src(['lib/**/*.js', 'test/**/*.js'])
        .pipe(excludeGitignore())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
    nsp({ package: path.resolve('package.json') }, cb);
});

gulp.task('pre-test', function () {
    return gulp.src('lib/**/*.js')
        .pipe(excludeGitignore())
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
    var mochaErr;

    gulp.src('test/**/*.js')
        .pipe(plumber())
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', function (err) {
            mochaErr = err;
            throw err;
        })
        .pipe(istanbul.writeReports())
        .on('end', function () {
            cb(mochaErr);
        });
});

gulp.task('watch', function () {
    gulp.watch(['lib/**/*.js', 'test/**'], ['test']);
});

gulp.task('coveralls', function () {
    if (!process.env.CI) {
        return;
    }

    return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
        .pipe(coveralls());
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test', 'coveralls']);
gulp.task('ts', ['tstest']);
