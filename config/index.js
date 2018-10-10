'use strict'

// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: './static',
    assetsPublicPath: './',
    productionSourceMap: true,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8088,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: { // 请求代理服务器
      '/appServer': {
        // target: 'http://192.168.1.165:8082/appServer/',
        // target: 'http://192.168.1.203:8082/appServer/',
        // target: 'http://app.lbdfun.com:80',
        target: 'http://119.23.148.208:8084/appServer/',
        changeOrigin: true,
        pathRewrite: {
          '^/appServer': '/'
        }
      }
    },
    cssSourceMap: false
  }
}
