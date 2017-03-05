const sockjs = require('sockjs')
const path = require('path')
const clientStats = { errorDetails: false }

const PIXORE_PATH = path.join('/', process.env.PIXORE_PATH)

exports.rewriteListen = Server => {
  Server.prototype.listen = function () {
    const returnValue = this.listeningApp.listen.apply(this.listeningApp, arguments)
    const sockServer = sockjs.createServer({
      // Use provided up-to-date sockjs-client
      sockjs_url: path.join(PIXORE_PATH, '/__webpack_dev_server__/sockjs.bundle.js'),
      // Limit useless logs
      log (severity, line) {
        if (severity === 'error') {
          console.log(line)
        }
      }
    })
    sockServer.on('connection', conn => {
      if (!conn) return
      this.sockets.push(conn)

      conn.on('close', () => {
        const connIndex = this.sockets.indexOf(conn)
        if (connIndex >= 0) {
          this.sockets.splice(connIndex, 1)
        }
      })

      if (this.clientLogLevel) {
        this.sockWrite([conn], 'log-level', this.clientLogLevel)
      }
      if (this.clientOverlay) {
        this.sockWrite([conn], 'overlay', this.clientOverlay)
      }
      if (this.hot) this.sockWrite([conn], 'hot')

      if (!this._stats) return
      this._sendStats([conn], this._stats.toJson(clientStats), true)
    })

    sockServer.installHandlers(this.listeningApp, {
      prefix: path.join(PIXORE_PATH, '/sockjs-node')
    })
    return returnValue
  }
}
