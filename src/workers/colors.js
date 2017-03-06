import colorsWorker from './colors.worker'
import { getImageData } from '../utils/canvas'
import { store } from '../store'
import { getContext } from '../constants'

const cbs = {
  transparent: [],
  palette: []
}
const colors = colorsWorker()

colors.onmessage = onMessage

export const getTransparentColor = function (sprite, cb) {
  const { sprites } = store.getState()
  const frames = sprites[sprite].frames

  let dataList = []
  for (let i = 0; i < frames.length; i++) {
    dataList.push(getImageData(getContext(frames[i])))
  }
  colors.postMessage({type: 'transparent', data: dataList})
  cbs.transparent.push(cb)
}

function onMessage (evt) {
  let cbsT = cbs[evt.data.type]
  for (let j = 0; j < cbsT.length; j++) {
    cbsT[j](evt.data.data)
  }
  cbs[evt.data.type].length = 0
}

export const getSpritePalette = (sprite, transparent = false) => new Promise(resolve => {
  const state = store.getState()
  const frames = state.sprites[sprite].frames

  let dataList = []
  for (let i = 0; i < frames.length; i++) {
    let layers = state.frames[frames[i]].layers
    for (let j = 0; j < layers.length; j++) {
      dataList.push(getImageData(getContext(layers[j])))
    }
  }

  colors.postMessage({type: 'palette', data: dataList})
  cbs.palette.push(function (result) {
    if (!transparent) {
      result.array.splice(result.array.indexOf('rgba(0, 0, 0, 0)'), 1)
      delete result.obj['rgba(0, 0, 0, 0)']
    }
    resolve(result)
  })
})

export const worker = colors
