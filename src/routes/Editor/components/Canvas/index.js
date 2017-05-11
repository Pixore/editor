import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import {
  setSpriteArtboard
} from '../../../../ducks'
import { transparent, getContext } from '../../../../constants'
import { imageSmoothingDisabled, clean } from '../../../../utils/canvas'
import Menu from '../../../../components/Menu'
import Background from './Background'
import Preview from './Preview'
import Main from './Main'
import Mask from './Mask'
import Layer from './Layer'
import * as events from './events'

const canvasToContext = (name, context) => canvas => {
  if (!context[name]) {
    context[name] = canvas.getContext('2d')
  }
}

const setScale = function (scale, props) {
  const { sprite, setSpriteArtboard } = this.props
  const { id, artboard } = sprite
  let layer = this.props.layer
  let diffX, diffY
  if (scale < 1) {
    return
  }

  diffX = (layer.width * scale) - (artboard.scale * layer.width)
  diffY = (layer.height * scale) - (artboard.scale * layer.height)

  setSpriteArtboard(id, {
    x: artboard.x - Math.round(diffX / 2),
    y: artboard.y - Math.round(diffY / 2),
    scale: scale
  })
}

const setSize = (context, width, height) => {
  context.canvas.width = width
  context.canvas.height = height
}

const paintMain = function (context, artboard, layer) {
  const width = (layer.width * artboard.scale)
  const height = (layer.height * artboard.scale)
  clean(context.canvas)
  imageSmoothingDisabled(context)
  context.drawImage(getContext(layer.id).canvas,
    0, 0, layer.width, layer.height,
    artboard.x, artboard.y, width, height)
}

const paintBackground = function (context, artboard, layer) {
  const pattern = context.createPattern(transparent, 'repeat')
  clean(context.canvas)
  context.fillStyle = pattern
  context.fillRect(
    artboard.x, artboard.y, layer.width * artboard.scale, layer.height * artboard.scale
  )
}

const paintMask = function (context, artboard, layer) {
  context = context || this.context
  let width = (layer.width * artboard.scale)
  let height = (layer.height * artboard.scale)
  context.fillStyle = '#494949'
  context.fillRect(0, 0, context.canvas.width, context.canvas.width)
  context.clearRect(artboard.x, artboard.y, width, height)
}

// const paintPreview = function (context, artboard, cord) {
//   this.clean(context)
//   if (artboard.select) {
//     // this.paintAreaSelect()
//   }
//   let realCord = {
//     x: cord.x * artboard.scale + artboard.x,
//     y: cord.y * artboard.scale + artboard.y
//   }
//   context.strokeStyle = 'rgba(255, 255, 255, 0.6)' // COLOR_POINTER_PREW_DEF
//   context.fillStyle = this.props.primaryColor
//   context.strokeRect(realCord.x - 1, realCord.y - 1, artboard.scale + 2, artboard.scale + 2)
//   context.fillRect(realCord.x, realCord.y, artboard.scale, artboard.scale)
// }

class _Canvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  onWheel (evt) {
    const deltaY = evt.deltaY
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
      setScale(
        Math[method](this.props.sprite.artboard.scale * diff),
        this.props
      )
    }, 40)
  }

  shouldComponentUpdate (nextProps, nextState) {
    // console.log(nextProps.height, this.props.height, nextProps.height === this.props.height)
    // console.log(nextProps.width, this.props.width, nextProps.width === this.props.width)
    // console.log(nextProps.sprite, this.props.sprite, nextProps.sprite === this.props.sprite)
    // console.log(nextProps.frame, this.props.frame, nextProps.frame === this.props.frame)
    // console.log(nextProps.layer, this.props.layer, nextProps.layer === this.props.layer)
    // console.log(nextProps.layers, this.props.layers, nextProps.layers === this.props.layers)
    // console.log(nextProps.primaryColor, this.props.primaryColor, nextProps.primaryColor === this.props.primaryColor)
    // console.log(nextProps.secondaryColor, this.props.secondaryColor, nextProps.secondaryColor === this.props.secondaryColor)
    // console.log(nextProps.tool, this.props.tool, nextProps.tool === this.props.tool)
    if (this.props.sprite.artboard !== nextProps.sprite.artboard) {
      paintBackground(
        this.background,
        nextProps.sprite.artboard,
        nextProps.layer
      )
      paintMain(
        this.main,
        nextProps.sprite.artboard,
        nextProps.layer
      )
      paintMask(
        this.mask,
        nextProps.sprite.artboard,
        nextProps.layer
      )
    }

    const update = (
      this.state.stats !== nextState.stats &&
      this.state.marginTop !== nextState.marginTop &&
      this.state.marginLeft !== nextState.marginLeft
    )
    console.log(update)
    return update
  }

  componentDidMount () {
    [this.background, this.main, this.preview, this.mask]
      .forEach(context => setSize(context, this.props.width, this.props.height))
    const stats = this.el.parentElement.getBoundingClientRect()
    this.setState({
      stats,
      marginTop: -stats.top,
      marginLeft: -stats.left
    })
    if (!this.props.sprite.artboard && this.props.layer !== undefined) {
      events.center(stats, this.props)
    }
    // $(this.el)
    //   .offOn('mousedown.preview', this.onMouseDown, false)
    //   .offOn('mousemove.preview', this.onMouseMove, false)
  }
  render () {
    const {width, height} = this.props
    const style = {
      width,
      height,
      marginLeft: this.state.marginLeft,
      marginTop: this.state.marginTop
    }
    const { activeContextMenu, contextMenuPosition } = this.state
    console.log('render')
    return <div style={style} className='canvas' ref={el => this.el = el}>
      <canvas className='background' ref={canvasToContext('background', this)} />
      <canvas className='main' ref={canvasToContext('main', this)} />
      <canvas className='preview' ref={canvasToContext('preview', this)} />
      <canvas className='mask' ref={canvasToContext('mask', this)} />
      <Menu active={activeContextMenu} position={contextMenuPosition}>
        <li onClick={this.onCenter}>Center</li>
      </Menu>
    </div>
  }
}

const obj = Object.assign({}, events)

obj.displayName = 'Canvas'

_Canvas.propTypes = obj.propTypes = {
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

// export default connect(
//   null,
//   { setSpriteArtboard }
// )(React.createClass(obj))

export default connect(
  null,
  { setSpriteArtboard }
)(_Canvas)
