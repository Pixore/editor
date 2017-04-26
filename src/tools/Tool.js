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

const cordLayerToPaint = (cord, artboard) => ({
  x: (cord.x * artboard.scale) + artboard.x,
  y: (cord.y * artboard.scale) + artboard.y
})

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

common.fillPrevAt = function (pixel, color) {
  const newPixel = cordLayerToPaint(pixel, this.artboard)
  this.preview.fillStyle = color

  this.preview.clearRect(newPixel.x, newPixel.y, this.artboard.scale, this.artboard.scale)
  this.preview.fillRect(newPixel.x, newPixel.y, this.artboard.scale, this.artboard.scale)
}

common.cleanAt = function (pixel) {
  this.context.clearRect(pixel.x, pixel.y, 1, 1)
}

common.fillAt = function (pixel, color) {
  this.context.fillStyle = color
  this.context.clearRect(pixel.x, pixel.y, 1, 1)
  this.context.fillRect(pixel.x, pixel.y, 1, 1)
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
  layer = layer || this.layer
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

common.getRectangle = function (x1, y1, x2, y2, color, fn) {
  let stepX = x1 < x2 ? 1 : -1
  let stepY = y1 < y2 ? 1 : -1
  let diffX = Math.abs(x1 - x2)
  let diffY = Math.abs(y1 - y2)
  let tempX1 = x1
  let tempY1 = y1

  clean(this.preview.canvas)

  while (diffX > 0) {
    diffX--

    this[fn]({x: tempX1, y: y1}, color)
    this[fn]({x: tempX1, y: y2}, color)
    tempX1 += stepX
  }
  this[fn]({x: tempX1, y: y1}, color)
  this[fn]({x: tempX1, y: y2}, color)

  while (diffY > 0) {
    diffY--
    tempY1 += stepY
    this[fn]({x: x1, y: tempY1}, color)
    this[fn]({x: x2, y: tempY1}, color)
  }
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
