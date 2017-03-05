
const Promise = require('bluebird')
const webpack = require('webpack')
const historyApiFallback = require('connect-history-api-fallback')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const WebpackDevServer = require('webpack-dev-server')
const chalk = require('chalk')
const config = require('../config/webpack.config.js')
const { PORT, PIXORE_PATH } = require('../config/environment.js')
const { rewriteListen } = require('../config/webpackDevServer')

let compiler

rewriteListen(WebpackDevServer)

const setupCompile = () => {
  compiler = webpack(config)

  compiler.plugin('invalid', function () {
    console.log('Compiling...')
  })

  compiler.plugin('done', function (stats) {
    var messages = formatWebpackMessages(stats.toJson({}, true))
    var isSuccessful = !messages.errors.length && !messages.warnings.length

    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'))
    }

    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'))
      console.log()
      messages.errors.forEach(message => {
        console.log(message)
        console.log()
      })
    }

    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'))
      console.log()
      messages.warnings.forEach(message => {
        console.log(message)
        console.log()
      })
    }
  })
  return compiler
}

const runDevServer = compiler => new WebpackDevServer(compiler, {
  compress: true,
  clientLogLevel: 'none',
  contentBase: false,
  hot: true,
  publicPath: config.output.publicPath,
  quiet: true,
  watchOptions: {
    ignored: /node_modules/
  }
})

const addMiddleware = devServer => {
  devServer
    .use(historyApiFallback({
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', '*/*']
    }))
  devServer.use(devServer.middleware)
  return devServer
}
const onListen = (err, result) => {
  if (err) {
    return console.log(err)
  }
  console.log(chalk.cyan('Starting the development server...'))
  console.log(chalk.cyan('PORT: ', PORT))
  console.log(chalk.cyan('PATH: ', PIXORE_PATH))
}

const run = () =>
  Promise.resolve()
    .then(setupCompile)
    .then(runDevServer)
    .then(addMiddleware)
    .then(devServer => devServer.listen(PORT, onListen))

run()
