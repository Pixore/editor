import React from 'react'
import PropTypes from 'prop-types'
import { transparent } from '../../../../constants'

const obj = {}

obj.displayName = 'Background'

obj.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  artboard: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired
}

obj.componentDidMount = function () {
  const context = this.refs.canvas.getContext('2d')
  this.setState({ context })
  this.props.setContext('background', context)
}

obj.componentWillUpdate = function (nextProps) {
  return nextProps.width !== this.props.width ||
    nextProps.height !== this.props.height
}
obj.paint = function (context, artboard, layer) {
  context = context || this.state.context
  const pattern = context.createPattern(transparent, 'repeat')
  context.fillStyle = pattern
  context.fillRect(
    artboard.x, artboard.y, layer.width * artboard.scale, layer.height * artboard.scale
  )
}
obj.clean = function (context) {
  context.canvas.width = context.canvas.width
}
obj.componentDidUpdate = function () {
  if (this.props.artboard) {
    this.paint(this.state.context, this.props.artboard, this.props.layer)
  }
}
obj.render = function () {
  return (<canvas
    ref='canvas'
    width={this.props.width}
    height={this.props.height}
    className='background' />)
}

const Background = React.createClass(obj)

export default Background
