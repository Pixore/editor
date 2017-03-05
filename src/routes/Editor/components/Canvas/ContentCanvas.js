import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { register } from 'react-dynamic-layout'
import Canvas from './index'
const obj = {}

obj.displayName = 'ContentCanvas'

obj.getInitialState = function () {
  return {}
}

obj.componentDidMount = function () {
  let el = ReactDOM.findDOMNode(this)
  let stats = el.getBoundingClientRect()
  this.setState({
    stats,
    marginTop: -stats.top,
    marginLeft: -stats.left
  })
}

obj.render = function () {
  const {
    sprites,
    frames,
    layers,
    tool,
    style,
    width,
    height
  } = this.props

  const sprite = sprites[this.props.sprite]
  const valid = sprite &&
    sprite.frame &&
    Number.isInteger(sprite.layer)
  if (!valid) {
    return <div />
  }
  const frame = frames[sprite.frame]
  return <div style={style} className='content-canvas'>
    <Canvas
      width={width}
      height={height}
      sprite={sprite}
      frame={frame}
      layer={layers[frame.layers[sprite.layer]]}
      layers={layers}
      primaryColor={sprite.primaryColor}
      secondaryColor={sprite.secondaryColor}
      tool={tool}
    />
  </div>
}

function mapStateToProps (state) {
  return {
    sprite: state.editor.sprite,
    sprites: state.sprites,
    frames: state.frames,
    layers: state.layers,
    tool: state.editor.tool,
    artboard: state.editor.artboard
  }
}

const ContentCanvas = connect(
  mapStateToProps// ,
  // {setSpriteArtboar}
)(React.createClass(obj))

register(ContentCanvas, obj.displayName)

export default ContentCanvas
