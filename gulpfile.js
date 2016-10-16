"use strict";

var fs = require('fs');

var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var replace = require('gulp-just-replace');
var license = require('gulp-header');

//替换文本数组
var replaceArr = [{
  search: /\"preScroll\"/g,
  replacement: '1'
}, {
  search: /\"preZoom\"/g,
  replacement: '2'
}, {
  search: /\"scrollX\"/g,
  replacement: '3'
}, {
  search: /\"scrollY\"/g,
  replacement: '4'
}, {
  search: /\"scrollFree\"/g,
  replacement: '5'
}];

//压缩/备份JRoll主文件
gulp.task('default', function() {

  //获取头部注释
  fs.readFile('src/jroll.js', function(err, data) {
    if (err) throw err;
    var head = /\/\*.+v(\d+\.\d+\.\d+).+\*\//.exec(data.toString());
    var copyright = "/*! JRoll v2.0.0 ~ (c) 2015-2016 Author:jlong, Email:jlong@chjtx.com Website:http://www.chjtx.com/JRoll/ */\n;";
    var version = "2.0.0";
    if (head) {
      copyright = head[0] + '\n;';  //头部注释
      version = head[1];    //版本号
    }

    gulp.src('src/jroll.js')

      //备份原文件
      .pipe(rename({
        basename: 'jroll',
        extname: '.'+version+'.js'
      }))
      .pipe(gulp.dest('build/'))

      //替换（手动压缩）
      .pipe(replace(replaceArr))

      //压缩
      .pipe(uglify())

      //加入头部注释
      .pipe(license(copyright))

      //修改后缀
      .pipe(rename({
        basename: 'jroll',
        extname: '.min.js'
      }))

      //输出
      .pipe(gulp.dest('build/'))

      //备份
      .pipe(rename({
        basename: 'jroll',
        extname: '.'+version+'.min.js'
      }))
      .pipe(gulp.dest('build/'));

  });

});

//压缩jroll-pulldown.js
gulp.task('pulldown', function() {
  //获取头部注释
  fs.readFile('plugins/jroll-pulldown/jroll-pulldown.js', function(err, data) {
    if (err) throw err;
    var head = /\/\*.+v(\d+\.\d+\.\d+).+\*\//.exec(data.toString());
    var copyright = "/*! JRoll-PullDown v1.0.0 ~ (c) 2015-2016 Author:BarZu Git:https://git.oschina.net/chenjianlong/JRoll2/ */\n;";
    var version = "1.0.0";
    if (head) {
      copyright = head[0] + '\n;';  //头部注释
      version = head[1];    //版本号
    }

    gulp.src('plugins/jroll-pulldown/jroll-pulldown.js')

      //备份原文件
      .pipe(rename({
        basename: 'jroll-pulldown',
        extname: '.'+version+'.js'
      }))
      .pipe(gulp.dest('plugins/jroll-pulldown/build/'))

      //压缩
      .pipe(uglify())

      //加入头部注释
      .pipe(license(copyright))

      //备份
      .pipe(rename({
        basename: 'jroll-pulldown',
        extname: '.'+version+'.min.js'
      }))
      .pipe(gulp.dest('plugins/jroll-pulldown/build/'));

  });
});

//压缩jroll-infinite.js
gulp.task('infinite', function() {
  //获取头部注释
  fs.readFile('plugins/jroll-infinite/jroll-infinite.js', function(err, data) {
    if (err) throw err;
    var head = /\/\*.+v(\d+\.\d+\.\d+).+\*\//.exec(data.toString());
    var copyright = "/*! JRoll-Infinite v1.0.0 ~ (c) 2015-2016 Author:BarZu Git:https://git.oschina.net/chenjianlong/JRoll2/ */\n;";
    var version = "1.0.0";
    if (head) {
      copyright = head[0] + '\n;';  //头部注释
      version = head[1];    //版本号
    }

    gulp.src('plugins/jroll-infinite/jroll-infinite.js')

      //备份原文件
      .pipe(rename({
        basename: 'jroll-infinite',
        extname: '.'+version+'.js'
      }))
      .pipe(gulp.dest('plugins/jroll-infinite/build/'))

      //压缩
      .pipe(uglify())

      //加入头部注释
      .pipe(license(copyright))

      //备份
      .pipe(rename({
        basename: 'jroll-infinite',
        extname: '.'+version+'.min.js'
      }))
      .pipe(gulp.dest('plugins/jroll-infinite/build/'));

  });
});

//压缩jroll-fixedinput.js
gulp.task('fixedinput', function() {
  //获取头部注释
  fs.readFile('plugins/jroll-fixedinput/jroll-fixedinput.js', function(err, data) {
    if (err) throw err;
    var head = /\/\*.+v(\d+\.\d+\.\d+).+\*\//.exec(data.toString());
    var copyright = "/*! JRoll-FixedInput v1.0.0 ~ (c) 2015-2016 Author:BarZu Git:https://git.oschina.net/chenjianlong/JRoll2/ */\n;";
    var version = "1.0.0";
    if (head) {
      copyright = head[0] + '\n;';  //头部注释
      version = head[1];    //版本号
    }

    gulp.src('plugins/jroll-fixedinput/jroll-fixedinput.js')

      //备份原文件
      .pipe(rename({
        basename: 'jroll-fixedinput',
        extname: '.'+version+'.js'
      }))
      .pipe(gulp.dest('plugins/jroll-fixedinput/build/'))

      //压缩
      .pipe(uglify())

      //加入头部注释
      .pipe(license(copyright))

      //备份
      .pipe(rename({
        basename: 'jroll-fixedinput',
        extname: '.'+version+'.min.js'
      }))
      .pipe(gulp.dest('plugins/jroll-fixedinput/build/'));

  });
});