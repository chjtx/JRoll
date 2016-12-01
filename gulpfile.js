'use strict'

var fs = require('fs')

var gulp = require('gulp')
var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var replace = require('gulp-just-replace')
var license = require('gulp-header')

// 压缩/备份JRoll主文件
gulp.task('default', function () {
  // 获取头部注释
  fs.readFile('src/jroll.js', function (err, data) {
    if (err) throw err
    var head = /\/\*.+v(\d+\.\d+\.\d+).+\*\//.exec(data.toString())
    var copyright = '/*! JRoll v2.0.0 ~ (c) 2015-2016 Author:jlong, Email:jlong@chjtx.com Website:http://www.chjtx.com/JRoll/ */\n;'
    var version = '2.0.0'
    if (head) {
      copyright = head[0] + '\n;'  // 头部注释
      version = head[1]    // 版本号
    }

    gulp.src('src/jroll.js')

      // 备份原文件
      .pipe(rename({
        basename: 'jroll',
        extname: '.' + version + '.js'
      }))
      .pipe(gulp.dest('build/'))

      // 压缩
      .pipe(uglify())

      // 加入头部注释
      .pipe(license(copyright))

      // 修改后缀
      .pipe(rename({
        basename: 'jroll',
        extname: '.min.js'
      }))

      // 输出
      .pipe(gulp.dest('build/'))

      // 备份
      .pipe(rename({
        basename: 'jroll',
        extname: '.' + version + '.min.js'
      }))
      .pipe(gulp.dest('build/'))
  })
})

// 压缩、备份扩展组件等
function build (options) {
  gulp.src(options.src)

    // 备份原文件
    .pipe(rename({
      basename: options.basename,
      extname: '.' + options.version + '.js'
    }))
    .pipe(license(options.copyright))
    .pipe(replace([{
      search: /\{\{version\}\}/g,
      replacement: options.version
    }]))
    .pipe(gulp.dest(options.dest))

    // 压缩
    .pipe(uglify())

    // 加入头部注释
    .pipe(license(options.copyright))
    .pipe(rename({
      basename: options.basename,
      extname: '.' + options.version + '.min.js'
    }))
    .pipe(gulp.dest(options.dest))
}

// JRollViewer 压缩、备份
gulp.task('viewer', function () {
  let version = JSON.parse(fs.readFileSync('./package.json'))['version-viewer']
  let copyright = `/*! JRollViewer v${version} ~ (c) 2016 Author:BarZu Git:https://github.com/chjtx/JRoll/tree/master/plugins/jroll-viewer */\n`

  build({
    version: version,
    copyright: copyright,
    src: 'plugins/jroll-viewer/jroll-viewer.js',
    dest: 'plugins/jroll-viewer/build/',
    basename: 'jroll-viewer'
  })
})

// jroll-fixedinput 压缩、备份
gulp.task('fixedinput', function () {
  let version = JSON.parse(fs.readFileSync('./package.json'))['version-fixedinput']
  let copyright = `/*! JRoll-FixedInput v${version} ~ (c) 2016 Author:BarZu Git:https://github.com/chjtx/JRoll/tree/master/extends/jroll-fixedinput */\n`

  build({
    version: version,
    copyright: copyright,
    src: 'extends/jroll-fixedinput/jroll-fixedinput.js',
    dest: 'extends/jroll-fixedinput/build/',
    basename: 'jroll-fixedinput'
  })
})

// jroll-infinite 压缩、备份
gulp.task('infinite', function () {
  let version = JSON.parse(fs.readFileSync('./package.json'))['version-infinite']
  let copyright = `/*! JRoll-Infinite v${version} ~ (c) 2016 Author:BarZu Git:https://github.com/chjtx/JRoll/tree/master/extends/jroll-infinite */\n`

  build({
    version: version,
    copyright: copyright,
    src: 'extends/jroll-infinite/jroll-infinite.js',
    dest: 'extends/jroll-infinite/build/',
    basename: 'jroll-infinite'
  })
})

// jroll-pulldown 压缩、备份
gulp.task('pulldown', function () {
  let version = JSON.parse(fs.readFileSync('./package.json'))['version-pulldown']
  let copyright = `/*! JRoll-Pulldown v${version} ~ (c) 2016 Author:BarZu Git:https://github.com/chjtx/JRoll/tree/master/extends/jroll-pulldown */\n`

  build({
    version: version,
    copyright: copyright,
    src: 'extends/jroll-pulldown/jroll-pulldown.js',
    dest: 'extends/jroll-pulldown/build/',
    basename: 'jroll-pulldown'
  })
})
