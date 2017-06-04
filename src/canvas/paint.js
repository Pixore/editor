import { transparent, getContext } from '../constants'
import { imageSmoothingDisabled, clean } from '../utils/canvas'

export const paintMain = function (context, artboard, layer) {
  const width = (layer.width * artboard.scale)
  const height = (layer.height * artboard.scale)
  clean(context.canvas)
  imageSmoothingDisabled(context)
  context.drawImage(getContext(layer.id).canvas,
    0, 0, layer.width, layer.height,
    artboard.x, artboard.y, width, height)
}

export const paintBackground = function (context, artboard, layer) {
  const pattern = context.createPattern(transparent, 'repeat')
  clean(context.canvas)
  context.fillStyle = pattern
  context.fillRect(
    artboard.x, artboard.y, layer.width * artboard.scale, layer.height * artboard.scale
  )
}

export const paintMask = function (context, artboard, layer) {
  context = context || this.context
  let width = (layer.width * artboard.scale)
  let height = (layer.height * artboard.scale)
  context.fillStyle = '#494949'
  context.fillRect(0, 0, context.canvas.width, context.canvas.width)
  context.clearRect(artboard.x, artboard.y, width, height)
}
