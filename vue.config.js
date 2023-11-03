const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  // assetsDir: 'static',
  devServer: {
    proxy: {
      '/api': {
        target: 'xxxxx', //代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        //ws: true,         // proxy websockets
        pathRewrite: {
          //pathRewrite方法重写url /api/test ==> /test
          '^/api': '',
        },
      },
    },
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', resolve('src')).set('lin', resolve('src/lin')).set('assets', resolve('src/assets'))
    config.module.rule('ignore').test(/\.md$/).use('ignore-loader').loader('ignore-loader').end()
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      extensions: [".js", ".json", ".vue", ".scss", ".html"]
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/style/shared.scss";`,
      },
    },
  },
  devServer: {
    port: 8080
  },
  // node_modules依赖项es6语法未转换问题
  transpileDependencies: ['vuex-persist'],
}
