import React from 'react'
import { connect } from 'react-redux'

import { noTransparent, getBlob } from '../../utils/canvas'
import Gif from '../../utils/gif/gif'
import { getContext } from '../../constants'
import Menu from '../Menu'
import http from '../../utils/http'

import {
  saveEditor,
  setSpriteId
} from '../../ducks'

const generateGif = (sprite, scale) => new Promise(resolve => {
  const transparent = parseInt(sprite.transparent.substring(1), 16)
  const gif = new Gif({
    quality: 1,
    repeat: 0,
    height: sprite.height * scale,
    width: sprite.width * scale,
    preserveColors: true
  }).on('finished', resolve)

  sprite.frames.forEach(frame => gif.addFrame(
    noTransparent(getContext(frame), scale, sprite.transparent),
    { transparent: transparent }
  ))
  gif.render()
})

const saveFrame = function (props, index) {
  const { frames, layers } = props
  let frame = frames[index]
  let context = document.createElement('canvas').getContext('2d')
  context.canvas.width = frame.layers.length * frame.width
  context.canvas.height = frame.height
  frame.layers.forEach(onForEach.bind(this))

  function onForEach (item, index) {
    let layer = layers[item]
    context.drawImage(getContext(layer.id).canvas,
      0, 0, layer.width, layer.height,
      index * layer.width, 0, layer.width, layer.height
    )
  }
  return context
}

const onSave = props => {
// if (!this.props.user) {
  //   return ModalManager.open(<Login onLogin={this.onLogin} />)
  // }
  const { frames, sprite } = props
  const numFrames = sprite.frames.length
  const numLayers = frames[sprite.frames[0]].layers.length
  const isGif = sprite.frames.length > 1
  const isNew = !sprite._id
  const context = document.createElement('canvas').getContext('2d')
  const width = numLayers * sprite.width
  const height = numFrames * sprite.height
  const files = []

  context.canvas.width = width
  context.canvas.height = height

  sprite.frames.forEach((item, index) => {
    let frame = saveFrame(props, item)
    context.drawImage(frame.canvas,
      0, 0, width, sprite.height,
      0, sprite.height * index, width, sprite.height
    )
  })
  const promise = isGif
    ? generateGif(sprite, 1)
    : getBlob(getContext(sprite.frames[0]).canvas)

  promise.then(blob => {
    files.push({file: blob, name: 'preview.' + (isGif ? 'gif' : 'png')})
    return getBlob(context.canvas)
  }).then(blob => {
    var method, url
    if (isNew) {
      method = 'POST'
      url = '/api/sprites'
    } else {
      method = 'PUT'
      url = '/api/sprites/' + sprite._id
    }

    files.push({file: blob, name: 'sprite.png'})

    return http.upload(url, {
      title: sprite.name,
      width: sprite.width,
      height: sprite.height,
      frames: numFrames,
      layers: numLayers,
      type: isGif ? 'gif' : 'png',
      private: false,
      colors: sprite.palette
    }, files, method)
  }).then(result => {
    if (isNew) {
      props.setSpriteId(sprite.id, result._id)
      props.saveEditor()
    }
    console.log('save result', result)
  })
  return context.canvas
}

const Proyect = props => (
  <Menu child>
    Project
    <li >new project</li>
    <li onClick={onSave.bind(null, props)}>save sprite</li>
    <li onClick={props.openNewSpriteModal}>new sprite</li>
  </Menu>
)

function mapStateToProps (state) {
  return {
    frames: state.frames,
    layers: state.layers,
    sprite: state.sprites[state.editor.sprite]
  }
}

export default connect(
  mapStateToProps,
  { setSpriteId, saveEditor }
)(Proyect)
