// const { defineConfig } = require('@vue/cli-service')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        './src/assets/styles/mixins.less', './src/assets/styles/variables.less'
      ]
    }
  },
  devServer: {
    allowedHosts: 'all'
  },
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  }
}
