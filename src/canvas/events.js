import {
  calculatePosition,
  validCord,
  getPreviewSize,
  clean as cleanCanvas
} from '../utils/canvas'
import {
  RIGHT_CLICK,
  LEFT_CLICK,
  getContext
} from '../constants'

import * as tools from '../tools'

const { floor } = Math
let lastDragX, lastDragY

export const onMouseMove = function (evt) {
  let cord
  const preview = getContext('preview')
  if (evt.target.tagName === 'CANVAS') {
    evt.preventDefault()
    cord = calculatePosition(this.props.sprite.artboard, evt.clientX, evt.clientY)
    if (validCord(this.props.layer, cord)) {
      paintPreview(cord, preview, this.props.sprite)
    } else {
      cleanCanvas(preview.canvas)
    }
  }
}

export const paintPreview = function (cord, context, sprite) {
  const { primaryColor, artboard } = sprite
  cleanCanvas(context.canvas)
  if (artboard.select) {
    // this.paintAreaSelect()
  }
  let realCord = {
    x: cord.x * artboard.scale + artboard.x,
    y: cord.y * artboard.scale + artboard.y
  }
  context.strokeStyle = 'rgba(255, 255, 255, 0.6)' // COLOR_POINTER_PREW_DEF
  context.fillStyle = primaryColor
  context.strokeRect(realCord.x - 1, realCord.y - 1, artboard.scale + 2, artboard.scale + 2)
  context.fillRect(realCord.x, realCord.y, artboard.scale, artboard.scale)
}

export const center = function (stats, props) {
  let { sprite, setSpriteArtboard } = props
  let size = getPreviewSize(stats.width, stats.height, sprite.width, sprite.height)
  setSpriteArtboard(sprite.id, {
    scale: floor(size.scale),
    x: Number.parseInt(stats.left + size.marginLeft),
    y: floor(stats.top + size.marginTop)
  })
}

const openContextMenu = function (evt) {
  this.setState({
    activeContextMenu: true,
    contextMenuPosition: {
      x: evt.clientX,
      y: evt.clientY
    }
  })
}

export const onMouseDown = function (evt, state) {
  evt.stopImmediatePropagation()
  evt.preventDefault()
  let cord
  const { $preview, preview } = this
  const { sprite, layer, tool } = this.props
  cord = calculatePosition(sprite.artboard, evt.clientX, evt.clientY)
  if (!validCord(this.props.layer, cord)) {
    if (evt.which === RIGHT_CLICK) {
      openContextMenu.call(this, evt)
    } else if (this.state.activeContextMenu) { // is open the ContextMenu?
      this.setState({
        activeContextMenu: false
      })
    }
    return
  } else if (this.state.activeContextMenu) {
    // if ContextMenu is open, close it
    this.setState({
      activeContextMenu: false
    })
  }
  if (!window.META_KEY && (evt.which === RIGHT_CLICK || evt.which === LEFT_CLICK)) {
    cleanCanvas(preview.canvas)
    offMousePreview($preview, this)

    tools[tool].onMouseDownInit(
      evt,
      cord,
      layer,
      sprite.artboard,
      {
        main: this.main,
        preview: this.preview,
        background: this.background,
        mask: this.mask
      }
    )
  } else {
    lastDragX = evt.clientX
    lastDragY = evt.clientY
    cleanCanvas(preview.canvas)
    onDrag(this.shiftDiff)
  }
}

export const offMousePreview = function ($canvas, self) {
  $canvas.off('mousemove.preview').offOn('mouseup.preview', () => {
    $canvas.off('mouseup.preview').offOn('mousemove.preview', onMouseMove.bind(self), false)
  }, false)
}

const onDragMove = function (shiftDiff, evt) {
  evt.preventDefault()
  let diffX = evt.clientX - lastDragX
  let diffY = evt.clientY - lastDragY
  lastDragX = evt.clientX
  lastDragY = evt.clientY
  shiftDiff(diffX, diffY)
}

const onDrag = function (shiftDiff) {
  $window
    .off('mousemove.canvas')
    .on('mousemove.canvas', onDragMove.bind(null, shiftDiff), false)
    .off('mouseup.canvas').on('mouseup.canvas', () => {
      $window
        .off('mouseup.canvas')
        .off('mousemove.canvas')
    })
}
