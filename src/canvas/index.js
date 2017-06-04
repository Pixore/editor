import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Menu from '../components/Menu'

import {
  setSpriteArtboard
} from '../ducks'

import { canvasToContext } from '../utils/canvas'
import { setBinds } from '../utils/object'

import { $ } from '../utils/dom'

import {
  paintBackground,
  paintMain,
  paintMask
} from './paint'
import {
  center,
  onMouseDown,
  onMouseMove
} from './events'

const { ceil } = Math

const setSize = (context, width, height) => {
  context.canvas.width = width
  context.canvas.height = height
  return context
}

const setScale = function (scale, props) {
  const { sprite, setSpriteArtboard, layer } = props
  const { id, artboard } = sprite
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

let out
class Canvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    setBinds(this, ['onCenter', 'onWheel', 'shiftDiff'])
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
    if (this.props.sprite.artboard !== nextProps.sprite.artboard || this.props.sprite.version !== nextProps.sprite.version) {
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
      this.state.activeContextMenu !== nextState.activeContextMenu ||
      this.state.stats !== nextState.stats ||
      this.state.marginTop !== nextState.marginTop ||
      this.state.marginLeft !== nextState.marginLeft
    )
    return update
  }

  shiftDiff (diffX, diffY) {
    this.props.setSpriteArtboard(this.props.sprite.id, {
      scale: this.props.sprite.artboard.scale,
      x: ceil(this.props.sprite.artboard.x + diffX),
      y: ceil(this.props.sprite.artboard.y + diffY)
    })
  }

  componentDidMount () {
    [this.background, this.main, this.preview, this.mask]
      .forEach(context => setSize(context, this.props.width, this.props.height))
    const stats = this.el.parentElement.getBoundingClientRect()
    this.$preview = $(this.preview.canvas)
    this.setState({
      stats,
      marginTop: -stats.top,
      marginLeft: -stats.left
    })
    if (!this.props.sprite.artboard && this.props.layer !== undefined) {
      center(stats, this.props)
    }
    $(this.preview.canvas)
      .offOn('mousedown.preview', onMouseDown.bind(this), false)
      .offOn('mousemove.preview', onMouseMove.bind(this), false)
  }

  onCenter () {
    this.setState({
      activeContextMenu: false
    })
    center(this.state.stats, this.props)
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
    return <div style={style} className='canvas' ref={el => this.el = el} onWheel={this.onWheel}>
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

Canvas.propTypes = {
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

export default connect(
  null,
  { setSpriteArtboard }
)(Canvas)
