import { cuid } from 'react-dynamic-layout/lib'
import { addToast, removeToast } from '../ducks'
import store from '../store'
import Promise from 'bluebird'

export const show = (title, time = 10000) => {
  const id = cuid()
  store.dispatch(addToast({
    id,
    title
  }))
  Promise.delay(time).then(() => {
    store.dispatch(removeToast(id))
  })
}

export default {
  show
}
