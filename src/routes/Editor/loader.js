import { cuid } from 'react-dynamic-layout/lib'

import http from '../../utils/http'
import { wrapActionCreators } from '../../utils/ducks'
import { getContext } from '../../constants'
import { bindObject } from '../../utils/object'
import { createSprite } from '../../utils/sprites'
import { store } from '../../store'

import {
  setEditorId,
  addSprite,
  openSprite,
  selectSpriteFrame,
  setCurrentSprite,
  addFrame,
  addFrameSprite,
  addLayer,
  addLayerFrame,
  selectSpriteLayer
} from '../../ducks'

const { dispatch } = store

const actions = wrapActionCreators(dispatch, {
  setEditorId,
  addSprite,
  openSprite,
  selectSpriteFrame,
  setCurrentSprite,
  addFrame,
  addFrameSprite,
  addLayer,
  addLayerFrame,
  selectSpriteLayer
})

const loader = {}

loader.ensure = function () {
  require.ensure([], (require) => this.cb(require('./Editor').default))
}

loader.onClose = function () {
  this.ensure()
}

loader.onGetEditor = function (result) {
  const { _id, sprites } = result
  actions.setEditorId(_id)
  Promise.all(
    sprites.map(
      sprite => http.get('/api/sprites/' + sprite)
        .then(onGetSprite)
    )
  )
    .then(this.ensure)
    .catch(console.error)
}

const onGetSprite = sprite => new Promise(resolve => {
  let image = new Image()
  let width, height
  let context = document.createElement('canvas').getContext('2d')
  context.canvas.width = width = sprite.width * sprite.layers
  context.canvas.height = height = sprite.height
  sprite.id = cuid()
  actions.addSprite({
    id: sprite.id,
    _id: sprite._id,
    name: sprite.name,
    width: sprite.width,
    height: sprite.height,
    colors: sprite.colors,
    primaryColor: sprite.primaryColor || sprite.colors[0] || 'rgba(0, 255, 0, 1)',
    secondaryColor: sprite.secondaryColor || 'rgba(0, 0, 0, 0)'
  })
  actions.openSprite(sprite.id)
  actions.setCurrentSprite(sprite.id)
  image.onload = () => {
    context.drawImage(image,
      0, 0, width, height,
      0, 0, width, height
    )
    actions.selectSpriteFrame(
      sprite.id,
      createFrameFromContext(sprite, context)
    )
    actions.selectSpriteLayer(sprite.id, 0)
    for (let j = 1; j < sprite.frames; j++) {
      context.canvas.height = height// clean
      context.drawImage(image,
        0, j * height, width, height,
        0, 0, width, height
      )
      createFrameFromContext(sprite, context)
    }
    resolve()
  }
  image.src = `/api/sprites/${sprite._id}/file`
})

const createFrameFromContext = function (sprite, image) {
  const frame = cuid()
  let contextTemp = document.createElement('canvas').getContext('2d')
  contextTemp.canvas.width = sprite.width
  contextTemp.canvas.height = sprite.height

  actions.addFrame({
    id: frame,
    sprite: sprite.id,
    width: sprite.width,
    height: sprite.height,
    layers: []
  })
  const context = getContext(frame)
  for (var j = sprite.layers - 1; j >= 0; j--) {
    context.drawImage(image.canvas,
      sprite.width * j, 0, sprite.width, sprite.height,
      0, 0, sprite.width, sprite.height
    )
  }

  actions.addFrameSprite(
    sprite.id,
    frame
  )
  for (let j = 0; j < sprite.layers; j++) {
    let layer
    contextTemp.canvas.height = sprite.height// clean
    contextTemp.drawImage(image.canvas,
      sprite.width * j, 0, sprite.width, sprite.height,
      0, 0, sprite.width, sprite.height
    )
    layer = createLayersFromContext(sprite, contextTemp, frame, j)
    actions.addLayerFrame(
      frame,
      layer
    )
  }
  return frame
}

const createLayersFromContext = function (sprite, image, frame, index) {
  const layer = cuid()
  actions.addLayer({
    id: layer,
    width: sprite.width,
    height: sprite.height,
    sprite: sprite.id,
    frame: frame,
    layerIndex: index
  })
  const context = getContext(layer)
  context.drawImage(image.canvas,
    0, 0, sprite.width, sprite.height,
    0, 0, sprite.width, sprite.height
  )

  return layer
}

loader.init = function (cb) {
  http.get('/api/editor/user/last')
    .then(this.onGetEditor)
    .catch(err => {
      console.log(err)
      createSprite({current: true})
      this.ensure()
    })
  this.cb = cb
}

bindObject(loader)

export default (cb) => loader.init(cb)
