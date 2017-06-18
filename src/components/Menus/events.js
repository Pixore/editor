import http from '../../utils/http'
import Gif from '../../utils/gif/gif'
import { noTransparent } from '../../utils/canvas'
import { getContext } from '../../constants'
// import { ModalManager } from 'react-dynamic-modal'
// import Login from '../../../../modals/Login'

import createDebug from 'debug'

const debug = createDebug('')

export const onResize = function () {
  debug('resize')
}

export const onSetBackground = function () {
  debug('setBackgroud')
}

export const onLogin = function () {
  debug('now save the sprite')
}

export const onSave = function () {
  // if (!this.props.user) {
  //   return ModalManager.open(<Login onLogin={this.onLogin} />)
  // }
  const { frames, sprite } = this.props

  const self = this
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
    const frame = this.saveFrame(item)
    context.drawImage(frame.canvas,
      0, 0, width, sprite.height,
      0, sprite.height * index, width, sprite.height
    )
  })
  if (isGif) {
    this.generateGif(sprite, 1, onGeneratePreview)
  } else {
    getContext(sprite.frames[0]).canvas.toBlob(onGeneratePreview)
  }

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
      name: sprite.name,
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
    debug('save result', result)
  }
  return context.canvas
}

export const generateGif = function (sprite, scale, cb) {
  const gif = new Gif({
    quality: 1,
    repeat: 0,
    height: sprite.height * scale,
    width: sprite.width * scale,
    preserveColors: true
  })
  gif.on('finished', cb)

  generate.call(this, sprite.transparent)

  function generate (transparent) {
    const transparentDec = parseInt(transparent.substring(1), 16)
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
  const frame = frames[index]
  const context = document.createElement('canvas').getContext('2d')
  context.canvas.width = frame.layers.length * frame.width
  context.canvas.height = frame.height
  frame.layers.forEach(onForEach.bind(this))

  function onForEach (item, index) {
    const layer = layers[item]
    context.drawImage(getContext(layer.id).canvas,
      0, 0, layer.width, layer.height,
      index * layer.width, 0, layer.width, layer.height
    )
  }
  return context
}
