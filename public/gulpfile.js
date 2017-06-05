"use strict";
const gulp = require('gulp');
const zip = require('gulp-zip');
const sftp = require('gulp-sftp');
const less = require('gulp-less');
const babelify = require('babelify');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sequence = require('gulp-sequence')
const minifycss = require('gulp-minify-css');
const browserify = require('gulp-browserify');
let config = {
    command: "",
    suffix: ".min",
    less: {
        all: "*.less",
        src: "./less/",
        dest: "../www/html/css/",
        settings: {
            index: "index.less"
        }
    },
    js: {
        all: "*.js",
        src: "./src/",
        dest: "../www/html/script/",
        settings: {
            index: "index.js"
        }
    },
    zip: {
        name: "dest.zip",
        dest: "../dest/",
        src: "../dest/**/*",
    },
    sftp: {
        src: '../dest/dest.zip', //../dest/**/*
        host: '192.168.204.61',
        user: 'ningxiao',
        pass: 'nx4276',
        remotePath: '/opt/www/www.ningxiao.com/www/'
    }
};
(function() {
    let args = process.argv.slice(2);
    if (args.length > 1 && args[1].charAt(0) == "-") {
        config.command = args[1].replace("-", "");
    };
})()
/**
 * 编译less文件并且压缩生成min样式文件
 */
gulp.task('mincss', function() {
    if (config.less.settings[config.command]) {
        config.less.all = config.less.settings[config.command];
        console.log("mincss-->", config.less.all);
    };
    return gulp.src(config.less.src + config.less.all).pipe(less()).pipe(minifycss()).pipe(rename({
        suffix: config.suffix
    })).pipe(gulp.dest(config.less.dest));
});
/**
 * 压缩js使用commonjs规范压缩
 */
gulp.task('minjs', function() {
    if (config.js.settings[config.command]) {
        config.js.all = config.js.settings[config.command];
        console.log("minjs-->", config.js.all);
    };
    return gulp.src(config.js.src + config.js.all).pipe(browserify({
        // shim: {
        //     jquery: {
        //         path: './script/libs/jquery.min.js',
        //         exports: '$'
        //     }
        // },
        transform: [babelify.configure({
            presets: ['es2015']
        })]
    })).pipe(rename({
        suffix: config.suffix
    })).pipe(uglify()).pipe(gulp.dest(config.js.dest));
});
gulp.task('zip', function() {
    return gulp.src([config.zip.src, "!../dest/*.zip"]).pipe(zip(config.zip.name)).pipe(gulp.dest(config.zip.dest));
});
/**
 * 上线目录直接sftp上传服务器
 */
gulp.task('sftp', function() {
    return gulp.src(config.sftp.src).pipe(sftp(config.sftp));
});
gulp.task('ftp', sequence("zip", 'sftp'));
gulp.task('build', sequence('mincss', 'minjs'));