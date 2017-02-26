const path = require('path')
const express = require('express')
const { isDev, PORT, PUBLIC_PATH } = require('./config/environment')

const app = express()

if (isDev) {
  const webpack = require('webpack')
  const webpackMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('../webpack.config.js')

  const compiler = webpack(config)
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    quiet: false,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    stats: {
      colors: true
    }
  })

  const bundlePath = path.join(__dirname, './public/build/index.html')

  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
  app.get('*', function response (req, res) {
    res.write(middleware.fileSystem.readFileSync(bundlePath))
    res.end()
  })
} else {
  app.use(express.static(PUBLIC_PATH))
}

app.listen(PORT, '0.0.0.0', function onStart (err) {
  if (err) {
    console.log(err)
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', PORT, PORT)
})

module.exports = app
