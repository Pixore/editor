import { removeArrayItem } from '../utils/ducks'

const OPEN_SPRITE = 'OPEN_SPRITE'
const CLOSE_SPRITE = 'CLOSE_SPRITE'

const initialState = []

function reducer (state = [], action) {
  switch (action.type) {
    case OPEN_SPRITE:
      return state.concat([action.payload])
    case CLOSE_SPRITE:
      return removeArrayItem(state, action.payload)
    default:
      return state
  }
}

export const openSprite = sprite => ({
  type: OPEN_SPRITE,
  payload: sprite
})

export const closeSprite = sprite => ({
  type: CLOSE_SPRITE,
  payload: sprite
})

export default {
  reducer,
  initialState,
  types: {
    OPEN_SPRITE,
    CLOSE_SPRITE
  }
}
