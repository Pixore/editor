import React from 'react'
import PropTypes from 'prop-types'

import { getContext } from '../../../../constants'
import { imageSmoothingDisabled, clean } from '../../../../utils/canvas'
const obj = {}

obj.displayName = 'Main'

obj.getInitialState = () => ({})

obj.propTypes = {
  layer: PropTypes.object,
  artboard: PropTypes.object,
  setContext: PropTypes.func,
  style: PropTypes.object,
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  })
}

obj.componentDidMount = function () {
  const context = this.refs.canvas.getContext('2d')
  this.setState({ context })
  this.props.setContext('main', context)
}

obj.shouldComponentUpdate = function (nextProps, nextState) {
  const isAnotherLayer = this.props.layer.id !== nextProps.layer.id
  const isAnotherArtboard = this.props.artboard !== nextProps.artboard
  const isNewVersion = nextProps.layer.version !== this.props.layer.version
  const rePaint = isNewVersion || isAnotherArtboard || isAnotherLayer
  if (this.state && nextState.context && rePaint) {
    this.paint(nextState.context, nextProps.artboard, nextProps.layer)
  } else {
  }
  return false
}

obj.paint = function (context, artboard, layer) {
  const width = (layer.width * artboard.scale)
  const height = (layer.height * artboard.scale)
  clean(context.canvas)
  imageSmoothingDisabled(context)
  context.drawImage(getContext(layer.id).canvas,
    0, 0, layer.width, layer.height,
    artboard.x, artboard.y, width, height)
}

obj.componentDidUpdate = function () {
  if (this.state && this.state.context && this.props.layer && this.props.artboard) {
    this.paint(this.state.context, this.props.artboard, this.props.layer)
  }
}

obj.render = function () {
  return (<canvas
    ref='canvas'
    style={this.props.style}
    width={this.props.size.width}
    height={this.props.size.height}
    className='main' />)
}

const Main = React.createClass(obj)

export default Main
