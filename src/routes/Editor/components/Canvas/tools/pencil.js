import Tool from './Tool'
import { isTransparent } from '../../../../../utils/color'
import { calculatePosition, validCord } from '../../../../../utils/canvas'

const { abs } = Math
const obj = {}
let lastPixel, color, at

obj.onMouseDown = function (evt) {
  this.clicked = true
  lastPixel = this.initCord
  color = this.getColor(evt.which)
  if (isTransparent(color)) {
    at = this.clean
  } else {
    at = this.paint
  }
  $window.offOn('mouseup.upCanvas', this.onMouseUp, false)
  $window.offOn('mouseout.leaveCanvas', this.onMouseLeave, false)
  $window.offOn('mousemove.moveCanvas', this.onMouseMove, false)
}
obj.onMouseLeave = function (evt) {
  let el = evt.toElement || evt.relatedTarget
  if (el !== document.children[0]) {
    return
  }
  lastPixel = calculatePosition(this.artboard, evt.clientX, evt.clientY)
}
obj.clean = function (x, y) {
  this.preview.clearRect(
    (x * this.artboard.scale) + this.artboard.x,
    (y * this.artboard.scale) + this.artboard.y,
    this.artboard.scale, this.artboard.scale)
  this.context.clearRect(x, y, 1, 1)
}
obj.paint = function (x, y) {
  this.preview.fillStyle = color
  this.preview.fillRect(
    (x * this.artboard.scale) + this.artboard.x,
    (y * this.artboard.scale) + this.artboard.y,
    this.artboard.scale, this.artboard.scale)
  this.context.fillStyle = color
  this.context.fillRect(x, y, 1, 1)
}
obj.onMouseMove = function (evt) {
  if (this.clicked) {
    let newPixel = calculatePosition(this.artboard, evt.clientX, evt.clientY)
    if (validCord(this.layer, newPixel) || validCord(this.layer, lastPixel)) {
      if (abs(lastPixel.y - newPixel.y) > 1 || abs(lastPixel.x - newPixel.x) > 1) { // importantDiff
        this.lineBetween(lastPixel.x, lastPixel.y, newPixel.x, newPixel.y, at)
      } else {
        at(newPixel.x, newPixel.y)
      }
    }
    lastPixel = newPixel
  }
}
obj.onMouseUp = function (evt) {
  $window.off('mouseup.upCanvas')
  $window.off('mouseout.leaveCanvas')
  $window.off('mousemove.moveCanvas')
  if (this.clicked) {
    this.clicked = false
    let newPixel = calculatePosition(this.artboard, evt.clientX, evt.clientY)
    at(newPixel.x, newPixel.y)
    lastPixel = undefined
    this.newVersion(this.layer)
    this.addUndo({
      layer: this.layer,
      prevStatus: this.prevStatus
    })
  }
}

const pencil = Tool.create('pencil', obj)

export default pencil
