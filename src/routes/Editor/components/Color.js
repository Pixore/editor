import React from 'react'
import PropTypes from 'prop-types'
import createDebug from 'debug'

const debug = createDebug()

const obj = {}

obj.displayName = 'Color'

obj.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.string,
  size: PropTypes.any,
  className: PropTypes.string
}

obj.getDefaultProps = function () {
  return {
    click: true,
    size: 20,
    className: ''
  }
}

obj.getHandler = function () {
  return this.props.onClick || this.onClick
}

obj.onClick = function () {
  debug('color select')
}

obj.render = function () {
  var className = 'color transparent-bkg ' + this.props.className
  var styleBackground = {
    width: this.props.size,
    height: this.props.size
  }
  var styleColor = {
    background: this.props.color,
    width: this.props.size,
    height: this.props.size
  }
  return (<div className={className} style={styleBackground} onClick={this.getHandler()}>
    <div style={styleColor} />
  </div>)
}

const Color = React.createClass(obj)

export default Color
