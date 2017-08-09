import duck from '../toasts'

const { types } = duck

export default {
  addAction: {
    type: types.ADD_TOAST,
    payload: {
      id: 0,
      text: 'text',
      title: 'title',
      icon: 'icon'
    }
  },
  updateAction: {
    type: types.UPDATE_TOAST,
    payload: {
      id: 0,
      any: 'data'
    }
  },
  removeAction: {
    type: types.REMOVE_TOAST,
    payload: 0
  }
}
