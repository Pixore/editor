
import React from 'react'
import PropTypes from 'prop-types'

// import { imageSmoothingDisabled } from '../../../utils/canvas'

const obj = {}
obj.displayName = 'ContextCanvas'

obj.propTypes = {
  Component: PropTypes.element.isRequired
}

obj.saveRef = function (element) {
  this.setState(element)
}

obj.render = function () {
  const { Component, ...props } = this.props
  return <Component context={this.state} {...props} >
    <canvas ref={this.saveRef} />
  </Component>
}
