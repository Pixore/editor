import React from 'react'
import PropTypes from 'prop-types'
import { register } from 'react-dynamic-layout'

const obj = {}

obj.displayName = 'Label'

obj.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  text: PropTypes.string
}

obj.render = function () {
  return <div className={this.props.className} style={this.props.style}>
    <label>{this.props.text}</label>
  </div>
}

const Label = React.createClass(obj)

register(Label)

export default Label
