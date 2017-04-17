import React from 'react'
import PropTypes from 'prop-types'
const obj = {}
obj.displayName = 'Mask'

obj.getInitialState = function () {
  return {}
}

obj.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  artboard: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired
}

obj.componentDidMount = function () {
  let context = this.refs.canvas.getContext('2d')
  this.setState({ context })
  this.props.setContext('mask', context)
}

obj.paint = function (context, artboard, layer) {
  context = context || this.context
  let width = (layer.width * artboard.scale)
  let height = (layer.height * artboard.scale)
  context.fillStyle = '#494949'
  context.fillRect(0, 0, context.canvas.width, context.canvas.width)
  context.clearRect(artboard.x, artboard.y, width, height)
}

obj.componentDidUpdate = function () {
  if (this.state && this.state.context && this.props.layer && this.props.artboard) {
    this.paint(this.state.context, this.props.artboard, this.props.layer)
  }
}

obj.render = function () {
  return <canvas
    ref='canvas'
    width={this.props.width}
    height={this.props.height}
    className='mask' />
}

const Mask = React.createClass(obj)

export default Mask
