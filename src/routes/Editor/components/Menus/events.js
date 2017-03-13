import http from '../../../../utils/http'
// import React from 'react'
import Gif from '../../../../utils/gif/gif'
import { noTransparent } from '../../../../utils/canvas'
import { getContext } from '../../../../constants'
// import { ModalManager } from 'react-dynamic-modal'
// import Login from '../../../../modals/Login'

export const onResize = function () {
  alert('resize')
}

export const onSetBackground = function () {
  alert('setBackgroud')
}

export const onLogin = function () {
  console.log('now save the sprite')
}

export const onSave = function () {
  // if (!this.props.user) {
  //   return ModalManager.open(<Login onLogin={this.onLogin} />)
  // }
  const { frames, sprite } = this.props

  let self = this
  let numFrames = sprite.frames.length
  let numLayers = frames[sprite.frames[0]].layers.length
  let isGif = sprite.frames.length > 1
  let isNew = !sprite._id
  let context = document.createElement('canvas').getContext('2d')
  let width = numLayers * sprite.width
  let height = numFrames * sprite.height
  let files = []

  context.canvas.width = width
  context.canvas.height = height

  sprite.frames.forEach((item, index) => {
    let frame = this.saveFrame(item)
    context.drawImage(frame.canvas,
      0, 0, width, sprite.height,
      0, sprite.height * index, width, sprite.height
    )
  })
  isGif
    ? this.generateGif(sprite, 1, onGeneratePreview)
    : getContext(sprite.frames[0]).canvas.toBlob(onGeneratePreview)

  function onGeneratePreview (blob) {
    files.push({file: blob, name: 'preview.' + (isGif ? 'gif' : 'png')})
    context.canvas.toBlob(onGenerateBlob)
  }
  function onGenerateBlob (blob) {
    var method, url
    if (isNew) {
      method = 'POST'
      url = '/api/sprites'
    } else {
      method = 'PUT'
      url = '/api/sprites/' + sprite._id
    }

    files.push({file: blob, name: 'sprite.png'})

    http.upload(url, {
      title: sprite.name,
      width: sprite.width,
      height: sprite.height,
      frames: numFrames,
      layers: numLayers,
      type: isGif ? 'gif' : 'png',
      private: false,
      colors: sprite.palette
    }, files, method, onUpload.bind(self))
  }

  function onUpload (result) {
    if (isNew) {
      this.props.setSpriteId(sprite.id, result.description)
      this.props.saveEditor()
    }
    console.log('save result', result)
  }
  return context.canvas
}

export const generateGif = function (sprite, scale, cb) {
  let gif = new Gif({
    quality: 1,
    repeat: 0,
    height: sprite.height * scale,
    width: sprite.width * scale,
    preserveColors: true
  })
  gif.on('finished', cb)

  generate.call(this, sprite.transparent)

  function generate (transparent) {
    let transparentDec = parseInt(transparent.substring(1), 16)
    for (let i = 0; i < sprite.frames.length; i++) {
      gif.addFrame(
        noTransparent(this.props.frames[sprite.frames[i]].context, scale, transparent),
        {
          transparent: transparentDec
        }
      )
    }
    gif.render()
  }
}

export const saveFrame = function (index) {
  const { frames, layers } = this.props
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
