import { getContext, addContext } from '../constants'

const { floor } = Math

export function walkBitmap (bitmap, fn) {
  for (let x = 0; x < bitmap.length; x++) {
    for (let y = 0; y < bitmap[x].length; y++) {
      fn(bitmap[x][y], x, y)
    }
  }
}

export function imageSmoothing (ctx, value) {
  ctx.imageSmoothingEnabled = value
  ctx.mozImageSmoothingEnabled = value
  ctx.msImageSmoothingEnabled = value
}

export function imageSmoothingDisabled (ctx) {
  imageSmoothing(ctx, false)
}

export const canvasToContext = (name, self) => canvas => {
  if (!canvas) return
  const context = canvas.getContext('2d')
  if (!self[name]) {
    self[name] = context
  }
  if (!getContext(name)) {
    addContext(name, context)
  }
}

export function getPreviewSize (maxWidth, maxHeight, width, height) {
  var newWidth, newHeight, scale, maxSize
  var marginTop = 0
  var marginLeft = 0

  if (maxHeight > maxWidth) {
    maxSize = newWidth = maxWidth
    scale = maxWidth / width
    newHeight = height * scale
    marginTop = (maxHeight - newHeight) / 2
  } else {
    maxSize = newHeight = maxHeight
    scale = maxHeight / height
    newWidth = width * scale
    marginLeft = (maxWidth - newWidth) / 2
  }
  return {
    maxSize,
    maxWidth,
    maxHeight,
    width: newWidth,
    height: newHeight,
    marginTop,
    marginLeft,
    scale
  }
}

export function getNewContext (data) {
  var newContext = data.context || document.createElement('canvas').getContext('2d')
  if (!data.context) {
    newContext.canvas.width = data.width
    newContext.canvas.height = data.height
  }
  return newContext
}

export function calculatePosition (artboard, x, y) {
  x = floor((x - artboard.x) / artboard.scale)
  y = floor((y - artboard.y) / artboard.scale)
  return {x, y}
}

export function validCord (layer, cord) {
  return cord.x >= 0 && cord.x < layer.width && cord.y >= 0 && cord.y < layer.height
}

export function cloneContext (context) {
  let { width, height } = context.canvas
  let clone = document.createElement('canvas')
  clone.width = width
  clone.height = height
  clone = clone.getContext('2d')
  clone.drawImage(context.canvas,
    0, 0, width, height,
    0, 0, width, height
  )
  return clone
}

function scaleContext (context, scale = 1) {
  let { width, height } = context.canvas
  let clone = document.createElement('canvas')
  let scaleHeight = height * scale
  let scaleWidth = width * scale
  clone.width = scaleWidth
  clone.height = scaleHeight
  clone = clone.getContext('2d')
  imageSmoothingDisabled(clone)
  clone.drawImage(context.canvas,
    0, 0, width, height,
    0, 0, scaleWidth, scaleHeight
  )
  return clone
}

export function getImageData (context) {
  return context.getImageData(0, 0, context.canvas.width, context.canvas.height).data
}

export function noTransparent (context, scale, transparent) {
  let { width } = context.canvas
  let data = getImageData(context)
  context = scaleContext(context, scale)

  context.fillStyle = transparent
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) {
      let pos = i / 4
      let x = pos % width
      let y = ~~(pos / width)

      context.fillRect(x * scale, y * scale, scale, scale)
    }
  }
  return context
}

export function getColorPixel (width, cord, context) {
  var index = (cord.x + cord.y * width) * 4
  var imageData = getImageData(context)
  if (index >= 0 && index <= imageData.length) {
    return `rgba(${imageData[index]}, ${imageData[index + 1]}, ${imageData[index + 2]}, ${imageData[index + 3] / 255})`
  }
}

export const getBlob = canvas =>
  new Promise(resolve => canvas.toBlob(resolve))

export const clean = canvas => {
  canvas.width = canvas.width
  return canvas
}

export const isSameColor = (data, width, height, x, y, components1, components2) => {
  var index = (x + y * width) * 4
  if (x >= 0 && x < width && y >= 0 && y < height) {
    if (data[index] === components1[0] &&
      data[index + 1] === components1[1] &&
      data[index + 2] === components1[2] &&
      data[index + 3] / 255 === components1[3]) {
      data[index] = components2[0]
      data[index + 1] = components2[1]
      data[index + 2] = components2[2]
      data[index + 3] = components2[3] * 255
      return true
    }
  }
  return false
}
