import { store } from '../store'
import { cloneContext, clean, isSameColor } from '../utils/canvas'
import { getRGBAComponents } from '../utils/color'
import {
  setSpriteSecondaryColor,
  setSpritePrimaryColor,
  newSpriteVersion,
  addUndoPaint,
  newLayerVersion,
  newFrameVersion
} from '../ducks'

import { RIGHT_CLICK, getContext } from '../constants'

const { abs } = Math
const common = {}

common.RIGHT_CLICK = RIGHT_CLICK

common.getColor = function (which) {
  let state = store.getState()
  let sprite = state.sprites[this.layer.sprite]
  return which === RIGHT_CLICK ? sprite.secondaryColor : sprite.primaryColor
}

common.addUndo = function (data) {
  store.dispatch(addUndoPaint(data))
}

common.setPrimaryColor = function (color) {
  store.dispatch(
    setSpritePrimaryColor(
      this.layer.sprite,
      color
    )
  )
}

common.setSecondaryColor = function (color) {
  store.dispatch(
    setSpriteSecondaryColor(
      this.layer.sprite,
      color
    )
  )
}

common.newVersion = function (layer) {
  const state = store.getState()
  const frame = state.frames[layer.frame]
  const context = getContext(frame.id)
  clean(context.canvas)
  frame.layers.forEach(function (id) {
    context.drawImage(getContext(id).canvas,
      0, 0, frame.width, frame.height,
      0, 0, frame.width, frame.height
    )
  })
  store.dispatch(newLayerVersion(layer.id))
  store.dispatch(newFrameVersion(layer.frame))
  store.dispatch(newSpriteVersion(layer.sprite))
}

common.fill = function (initCord, newColor, oldColor, fn) {
  let stack = [initCord]
  let current
  let aside
  let numPixels = 4 * (this.layer.width * this.layer.height)
  let count = 0
  let dy = [-1, 0, 1, 0]
  let dx = [0, 1, 0, -1]
  let newComponents = getRGBAComponents(newColor)
  let oldComponents = getRGBAComponents(oldColor)

  if (!isSameColor(
        this.savedData,
        this.layer.width,
        this.layer.height,
        initCord.x,
        initCord.y,
        oldComponents,
        newComponents
      )
  ) {
    return
  }

  while (stack.length) {
    current = stack.pop()

    fn({x: current.x, y: current.y}, newColor)
    for (let i = 0; i < 4; i++) {
      aside = {x: current.x + dx[i], y: current.y + dy[i]}
      if (isSameColor(
            this.savedData,
            this.layer.width,
            this.layer.height,
            aside.x,
            aside.y,
            oldComponents,
            newComponents
          )
        ) {
        stack.push(aside)
      }
    }
    if (count > numPixels) {
      break
    }
    count++
  }
}

common.lineBetween = function (x1, y1, x2, y2, fn) {
  let dx = abs(x2 - x1)
  let dy = abs(y2 - y1)
  let sx = (x1 < x2) ? 1 : -1
  let sy = (y1 < y2) ? 1 : -1
  let err = dx - dy
  let e2
  while (x1 !== x2 || y1 !== y2) {
    fn(x1, y1)
    e2 = 2 * err
    if (e2 > -dy) {
      err -= dy; x1 += sx
    }
    if (e2 < dx) {
      err += dx; y1 += sy
    }
  }
  fn(x1, y1)
}

common.onMouseDown = () => console.log('Create onMouseDown function')

common.onMouseDownInit = function (evt, initCord, layer, artboard, {main, preview, background, mask}) {
  const context = getContext(layer.id)
  this.layer = layer
  this.prevStatus = cloneContext(context)
  this.artboard = artboard
  this.initCord = initCord
  this.main = main
  this.preview = preview
  this.background = background
  this.mask = mask
  this.context = context
  this.onMouseDown(evt)
}

export function create (name, custom) {
  let tool = Object.create(common)
  let keys = Object.keys(custom)
  for (var j = 0; j < keys.length; j++) {
    if (typeof custom[[keys[j]]] === 'function') {
      tool[keys[j]] = custom[[keys[j]]].bind(tool)
    }
  }
  tool.name = name
  return tool
}

export default {
  create
}