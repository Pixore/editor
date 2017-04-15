import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import {
  setSpriteArtboard
} from '../../../../ducks'
import Menu from '../../../../components/Menu'
import Background from './Background'
import Preview from './Preview'
import Main from './Main'
import Mask from './Mask'
import Layer from './Layer'
import * as events from './events'

const obj = Object.assign({}, events)

obj.displayName = 'Canvas'

obj.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  sprite: PropTypes.object.isRequired,
  frame: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
  primaryColor: PropTypes.string.isRequired,
  secondaryColor: PropTypes.string.isRequired,
  tool: PropTypes.string.isRequired
}

var out
obj.onWheel = function (evt) {
  let deltaY = evt.deltaY
  if (out) {
    return
  }
  out = setTimeout(() => {
    let diff = 1.06
    let method = 'floor'
    out = undefined
    if (deltaY > 0) {
      diff = 0.9
      method = 'floor'
    } else if (deltaY < 0) {
      diff = 1.1
      method = 'ceil'
    }
    this.setScale(Math[method](this.props.sprite.artboard.scale * diff))
  }, 40)
}
obj.setScale = function (scale) {
  let {sprite: {artboard}} = this.props
  let layer = this.props.layer
  let diffX, diffY
  if (scale < 1) {
    return
  }

  diffX = (layer.width * scale) - (artboard.scale * layer.width)
  diffY = (layer.height * scale) - (artboard.scale * layer.height)

  this.props.setSpriteArtboard(this.props.sprite.id, {
    x: artboard.x - Math.round(diffX / 2),
    y: artboard.y - Math.round(diffY / 2),
    scale: scale
  })
}

obj.componentDidUpdate = function () {
  if (!this.props.sprite.artboard) {
    this.center()
  }
}

obj.getInitialState = function () {
  return {}
}
obj.componentDidMount = function () {
  let el = ReactDOM.findDOMNode(this)
  let stats = el.parentElement.getBoundingClientRect()
  this.setState({
    stats,
    marginTop: -stats.top,
    marginLeft: -stats.left
  })
  if (!this.props.sprite.artboard && this.props.layer !== undefined) {
    this.center(stats)
  }
}

obj.setContextType = function (type, context) {
  let state = {}
  let $canvas = $(context.canvas)
  state[type] = {
    context,
    $canvas
  }
  this.setState(state)

  if (type === 'preview') {
    $canvas.offOn('mousedown.preview', this.onMouseDown, false)
    $canvas.offOn('mousemove.preview', this.onMouseMove, false)
  }
}

obj.getLayers = function (props) {
  const layers = []
  for (let index = 0; index < this.props.frame.layers.length; index++) {
    let layer = this.props.layers[this.props.frame.layers[index]]
    let finalProps = Object.assign({ /* , zIndex: index + 1 */}, props, {layer})
    if (layer.id === this.props.layer.id) {
      layers.push(
        <Layer {...finalProps} ref='active' key={index} />
      )
    } else {
      layers.push(
        <Layer {...finalProps} key={index} />
      )
    }
  }
  return layers
}

obj.render = function () {
  let {width, height, layer} = this.props
  let artboard = this.props.sprite.artboard || {}
  let setContext = this.setContextType
  let style = {
    width,
    height,
    marginLeft: this.state.marginLeft,
    marginTop: this.state.marginTop
  }
  let size = { width, height }
  var props = {
    size,
    artboard,
    layer,
    setContext
  }
  return <div style={style} className='canvas' onWheel={this.onWheel}>
    <Background {...{width, height, artboard, layer, setContext}} />
    <Main {...props} />
    <Preview {...props} />
    <Mask {...{width, height, artboard, layer, setContext}} />
    <Menu active={this.state.activeContextMenu} position={this.state.contextMenuPosition}>
      <li onClick={this.onCenter}>Center</li>
    </Menu>
  </div>
}

const Canvas = connect(
  null,
  { setSpriteArtboard }
)(React.createClass(obj))

export default Canvas
