import { cuid } from 'react-dynamic-layout/lib'
import { add, update, remove } from 'react-dynamic-layout/lib/store/reducer'

const ADD_TOAST = 'ADD_TOAST'
const REMOVE_TOAST = 'REMOVE_TOAST'
const UPDATE_TOAST = 'UPDATE_TOAST'

const initialState = {}

function reducer (state = initialState, {type, payload}) {
  switch (type) {
    case ADD_TOAST:
      return add(state, payload)
    case REMOVE_TOAST:
      return remove(state, payload)
    case UPDATE_TOAST:
      return update(state, payload)
    default:
      return state
  }
}

export const addToast = ({ id = cuid(), title, text, icon }) => ({
  type: ADD_TOAST,
  payload: {
    id,
    title,
    text,
    icon
  }
})

export const updateToast = (id, toast) => ({
  type: UPDATE_TOAST,
  payload: { ...toast, id }
})

export const removeToast = id => ({
  type: REMOVE_TOAST,
  payload: id
})

export default {
  reducer,
  initialState,
  types: {
    ADD_TOAST,
    REMOVE_TOAST,
    UPDATE_TOAST
  }
}
