const webpackConfig = require('./config/webpack.config.js')

webpackConfig.devtool = 'cheap-module-source-map'
webpackConfig.watch = true
module.exports = config => {
  config.set({
    browsers: ['Chrome'],
    singleRun: true,
    frameworks: ['mocha'],
    files: [
      './src/tests.webpack.js',
      {pattern: './src/**/*.spec.js', included: false, served: false, watched: true}
    ],
    preprocessors: {
      './src/tests.webpack.js': ['webpack']
    },
    plugin: [
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],
    reporters: ['mocha'],
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    }
  })
}
