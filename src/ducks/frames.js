import { cuid } from 'react-dynamic-layout/lib'
import { add, update, remove, addChild } from 'react-dynamic-layout/lib/store/reducer'
import { shiftPositions } from '../utils/ducks'
import { addContext } from '../constants'
import { getNewContext } from '../utils/canvas'

const ADD_FRAME = 'ADD_FRAME'
const REMOVE_FRAME = 'REMOVE_FRAME'
const ADD_LAYER_FRAME = 'ADD_LAYER_FRAME'
const NEW_FRAME_VERSION = 'NEW_FRAME_VERSION'
const CHANGE_LAYER_POSITION = 'CHANGE_LAYER_POSITION'

const initialState = {}

function reducer (state = initialState, {type, payload}) {
  switch (type) {
    case ADD_FRAME:
      return add(state, payload)
    case REMOVE_FRAME:
      return remove(state, payload)
    case ADD_LAYER_FRAME:
      return addChild(state, payload, 'layers')
    case NEW_FRAME_VERSION:
      return update(state, {
        id: payload,
        version: state[payload].version + 1
      })
    case CHANGE_LAYER_POSITION:
      return update(state, {
        id: payload,
        layers: shiftPositions(state[payload.frame].layers, payload.fromIndex, payload.toIndex)
      })
    default:
      return state
  }
}

export const addFrame = ({
  id = cuid(),
  width,
  height,
  sprite,
  layers = [],
  version = 0
}) => {
  addContext(id, getNewContext({width, height}))
  return {
    type: ADD_FRAME,
    payload: {
      id,
      width,
      height,
      sprite,
      layers,
      version
    }
  }
}

export const addLayerFrame = (frame, layer) => ({
  type: ADD_LAYER_FRAME,
  payload: {
    id: frame,
    child: layer
  }
})

export const removeFrame = frame => ({
  type: NEW_FRAME_VERSION,
  payload: frame
})

export const newFrameVersion = frame => ({
  type: NEW_FRAME_VERSION,
  payload: frame
})

export const changeLayerPosition = (frame, fromIndex, toIndex) => ({
  type: CHANGE_LAYER_POSITION,
  payload: {
    frame,
    fromIndex,
    toIndex
  }
})

export default {
  reducer,
  initialState,
  types: {
    ADD_FRAME,
    REMOVE_FRAME,
    ADD_LAYER_FRAME,
    NEW_FRAME_VERSION,
    CHANGE_LAYER_POSITION
  }
}
