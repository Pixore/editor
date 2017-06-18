import Tool from './Tool'
import { TRANSPARENT_COLOR } from '../constants'
import { calculatePosition, validCord, getColorPixel, getImageData } from '../utils/canvas'

const obj = {}
let color, oldColor

obj.onMouseDown = function (evt) {
  const newPixel = calculatePosition(this.artboard, evt.clientX, evt.clientY)
  if (evt.target.nodeName !== 'CANVAS' && !validCord(this.layer, newPixel)) return

  this.savedData = getImageData(this.prevStatus)
  this.clicked = true
  $window.offOn('mouseup.upCanvas', this.onMouseUp, false)
  color = this.getColor(evt.which)
  oldColor = getColorPixel(this.layer.width, newPixel, this.context)
  if (oldColor && color !== oldColor) {
    this.fill(
      newPixel,
      color,
      oldColor,
      color === TRANSPARENT_COLOR ? this.cleanAt : this.fillAt
    )
    this.newVersion(this.layer)
    this.addUndo({
      layer: this.layer,
      prevStatus: this.prevStatus
    })
  }
}

obj.onMouseUp = function (evt) {
  $window.off('mouseup.upCanvas')
  this.savedData = getImageData(this.prevStatus)
}

export default Tool.create('bucket', obj)
