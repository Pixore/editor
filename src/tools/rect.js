import Tool from './Tool'
import { TRANSPARENT_COLOR } from '../constants'
import { calculatePosition, getImageData } from '../utils/canvas'

const obj = {}

let firstPixel, lastPixel, color, at

obj.onMouseDown = function (evt) {
  if (evt.target.nodeName !== 'CANVAS') return
  this.savedData = getImageData(this.prevStatus)
  this.clicked = true
  firstPixel = calculatePosition(this.artboard, evt.clientX, evt.clientY)
  color = this.getColor(evt.which)
  at = 'fillPrevAt'
  $(window).off('mouseup.upCanvas').on('mouseup.upCanvas', this.onMouseUp)
  $(window).off('mouseout.leaveCanvas').on('mouseout.leaveCanvas', this.onMouseLeave)
  $(window).off('mousemove.moveCanvas').on('mousemove.moveCanvas', this.onMouseMove)
}

obj.onMouseLeave = function (evt) {
  if ((evt.toElement || evt.relatedTarget) !== document.children[0]) return

  let newPixel = calculatePosition(this.artboard, evt.clientX, evt.clientY)
  lastPixel = newPixel
}
obj.onMouseMove = function (evt) {
  lastPixel = calculatePosition(this.artboard, evt.clientX, evt.clientY)
  if (firstPixel.x !== lastPixel.x || firstPixel.y !== lastPixel.y) {
    this.getRectangle(firstPixel.x, firstPixel.y, lastPixel.x, lastPixel.y, color, at)
  }
}
obj.onMouseUp = function (evt) {
  $(window).off('mouseup.upCanvas')
  $(window).off('mouseout.leaveCanvas')
  $(window).off('mousemove.moveCanvas')
  if (color === TRANSPARENT_COLOR) {
    at = 'cleanAt'
  } else {
    at = 'fillAt'
  }
  this.clicked = true
  lastPixel = calculatePosition(this.artboard, evt.clientX, evt.clientY)
  this.getRectangle(firstPixel.x, firstPixel.y, lastPixel.x, lastPixel.y, color, at)
  this.newVersion()
  this.addUndo({
    layer: this.layer,
    prevStatus: this.prevStatus
  })
}

export default Tool.create('rect', obj)
