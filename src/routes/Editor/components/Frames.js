import React from 'react'
import PropTypes from 'prop-types'
import { cuid, register } from 'react-dynamic-layout/lib'
import { connect } from 'react-redux'
import classNames from 'classnames'

import Frame from './Frame'

import {
  addFrameSprite,
  selectSpriteFrame,
  addFrame,
  addLayerFrame,
  addLayer
} from '../../../ducks'

const obj = {}

obj.displayName = 'Frames'

obj.propTypes = {
  sprite: PropTypes.object.isRequired,
  frames: PropTypes.object.isRequired
}

obj.getDefaultProps = function () {
  return {
    frames: {},
    sprite: {
      frames: []
    }
  }
}
obj.getInitialState = function () {
  return {
    size: 0
  }
}
obj.componentDidMount = function () {
  this.setState({
    size: this.list.clientWidth
  })
}

obj.componentWillReceiveProps = function (nextProps) {
  if (this.props.rdWidth !== nextProps.rdWidth) {
    this.setState({
      size: this.list.clientWidth
    })
  }
}

obj.onClickAddFrame = function () {
  const sprite = this.props.sprite.id
  const numLayers = this.props.frames[this.props.frame].layers.length
  const frame = this.createFrame({sprite})
  for (let j = 0; j < numLayers; j++) {
    this.createLayer({
      sprite,
      frame
    })
  }
  this.props.selectSpriteFrame(this.props.sprite.id, frame)
}

obj.createFrame = function ({sprite, context}) {
  var currentFrame = this.props.frames[this.props.frame]
  const width = currentFrame.width
  const height = currentFrame.height
  const frame = cuid()
  this.props.addFrame({
    id: frame,
    width,
    height,
    sprite,
    context
  })
  this.props.addFrameSprite(sprite, frame)
  return frame
}

obj.onSelect = function (frame) {
  this.props.selectSpriteFrame(this.props.sprite.id, frame)
}

obj.getList = function () {
  if (!this.props.sprite || !this.props.frame) return []

  const children = []
  for (let j = 0; j < this.props.sprite.frames.length; j++) {
    const frame = this.props.frames[this.props.sprite.frames[j]]
    const className = classNames(
      'preview-frames',
      { 'active': this.props.frame === frame.id }
    )
    children.push(
      <li className={className} style={{width: this.state.size, height: this.state.size}} key={j}>
        <Frame data={frame} onSelect={this.onSelect} size={this.state.size}
          index={j} />
      </li>
    )
  }
  return children
}

obj.render = function () {
  return (<div className={'frames ' + this.props.className} style={this.props.style}>
    <button className='add-frame btn' onClick={this.onClickAddFrame}>add frame</button>
    <div className='list-content'>
      <ul className='list frames-list' ref={list => { this.list = list }}>
        {this.getList()}
      </ul>
    </div>
  </div>)
}

obj.createLayer = function ({sprite, frame, context, width, height}) {
  var currentFrame = this.props.frames[this.props.frame]
  const layer = cuid()
  width = width || currentFrame.width
  height = height || currentFrame.height
  this.props.addLayer({
    id: layer,
    width,
    height,
    sprite,
    frame,
    context
  })
  this.props.addLayerFrame(frame, layer)
  return layer
}

const Frames = connect(
  function (state) {
    const sprite = state.sprites[state.editor.sprite]
    return {
      sprite,
      frames: state.frames,
      frame: sprite.frame
    }
  },
  {selectSpriteFrame, addFrame, addFrameSprite, addLayerFrame, addLayer}
)(React.createClass(obj))

register(Frames, obj.displayName)

export default Frames
