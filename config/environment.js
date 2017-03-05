process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const path = require('path')

const config = {}

config.MONGODB_URI = process.env.MONGODB_URI
config.PORT = Number(process.env.PORT) || 80
config.PIXORE_PATH = process.env.PIXORE_PATH || ''
config.isDev = process.env.NODE_ENV === 'development'
config.isTest = process.env.NODE_ENV === 'test'
config.isProd = process.env.NODE_ENV === 'production'
config.ROOT_PATH = path.join(__dirname, '..')
config.BUILD_PATH = path.join(config.ROOT_PATH, 'build')
config.SRC_PATH = path.join(config.ROOT_PATH, 'src')
config.APP_PATH = path.join(config.SRC_PATH, 'index.js')
config.MODULES_PATH = path.join(config.ROOT_PATH, 'node_modules')
config.ASSETS_PATH = path.join(config.SRC_PATH, 'assets')
config.TEMPLATE_PATH = path.join(config.SRC_PATH, 'templates')
config.MAIN_TEMPLATE = path.join(config.TEMPLATE_PATH, 'production.jade')

if (config.isDev) {
  config.MAIN_TEMPLATE = path.join(config.TEMPLATE_PATH, 'development.jade')
}

module.exports = config
