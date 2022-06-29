const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        './src/assets/styles/mixins.less', './src/assets/styles/variables.less'
      ]
    }
  }
})
