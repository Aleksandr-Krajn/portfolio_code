const path = require('path');

module.exports = {
  transpileDependencies: [],

  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/assets/styles/abstracts/index.scss";'
      }
    }
  },

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg'); 
    
    svgRule.uses.clear();
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },

  configureWebpack: {
    resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          'assets': path.resolve(__dirname, 'src/assets'),
          'styles': path.resolve(__dirname, 'src/assets/styles'),
          'IzElements': path.resolve(__dirname, 'src/components/IzElements'),
          'constants': path.resolve(__dirname, 'src/assets/constants'),
        }
    }
  },
}
