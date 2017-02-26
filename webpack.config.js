const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const { isProd, MAIN_TEMPLATE, APP_PATH, PUBLIC_PATH } = require('./src/config/environment')

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
]
let devtool
let entry
let devServer
let externals = []

const modules = {
  rules: [{
    test: /\.js$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    exclude: /node_modules/
  }, {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  }, {
    test: /\.(jade|pug)$/,
    loader: 'pug-loader'
  }, {
    test: /\.css?$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader'
    })
  }, {
    test: /\.styl$/,
    loader: ExtractTextPlugin.extract({
      fallbackLoader: 'style-loader',
      loader: [
        'css-loader',
        'stylus-loader'
      ]
    })
  }, {
    test: /\.worker\.js?$/,
    use: [{
      loader: 'worker-loader',
      options: {
        name: 'workers/[name].[ext]'
      }
    }, 'babel-loader']
  }, {
    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
    loader: 'file-loader',
    options: {
      name: 'assets/[name].[hash:8].[ext]'
    }
  }]
}

const resolve = {
  extensions: ['.js', '.css', '.styl', '.jade']
}
const output = {
  path: PUBLIC_PATH,
  filename: 'bundle.js'
}

if (isProd) {
  entry = {
    index: APP_PATH
  }
  plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Pixore',
      filename: 'index.html',
      template: MAIN_TEMPLATE
    }),
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  )
} else {
  entry = [
    require.resolve('react-dev-utils/webpackHotDevClient.js'),
    APP_PATH
  ]
  devtool = 'source-map'
  plugins.push(
    new HtmlWebpackPlugin({
      title: 'Pixore',
      filename: 'index.html',
      template: MAIN_TEMPLATE
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WatchMissingNodeModulesPlugin(path.resolve('node_modules')),
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  )
  // devServer = {
  //   stats: {
  //     assets: false,
  //     colors: true,
  //     version: false,
  //     hash: false,
  //     timings: false,
  //     chunks: false,
  //     chunkModules: false
  //   },
  //   // historyApiFallback: true,
  //   port: 8001
  // }
}

module.exports = {
  devtool,
  entry,
  output,
  externals,
  module: modules,
  plugins,
  resolve,
  devServer,
  performance: {
    hints: false
  }
}
