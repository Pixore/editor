
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { store } from '../store'
import http from '../utils/http'
import {
  setUser
} from '../ducks'
import createDebug from 'debug'

const debug = createDebug('')

const obj = {}

obj.displayName = 'LoginButton'

obj.getDefaultProps = function () {
  return {
    onLogin: () => {}
  }
}

obj.propTypes = {
  onLogin: PropTypes.func,
  twitter: PropTypes.bool,
  className: PropTypes.string
}

obj.onClick = function (evt) {
  evt.preventDefault()
  let url = ''
  if (this.props.twitter) {
    url = '/api/auth/twitter'
  }

  this.newWin = window.open(url)
  this.intervalID = setInterval(this.intervalClose, 200)
}

obj.intervalClose = function () {
  if (!this.newWin.closed) return

  http.get('/api/auth/whoami').then(user => {
    debug(user)
    if (!user) return
    store.dispatch(setUser(user))
    this.props.onLogin()
  })
  clearInterval(this.intervalID)
}

obj.render = function () {
  let text = ''
  const style = {}
  const className = classNames(
    this.props.className,
    { 'twitter': this.props.twitter }
  )
  if (this.props.twitter) {
    text = 'Connect with Twitter'
    style.background = '#00aced'
  }
  return (
    <a
      href=''
      onClick={this.onClick}
      style={style}
      className={className}>
      {text}
    </a>
  )
}

const LoginButton = React.createClass(obj)

export default LoginButton
