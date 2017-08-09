import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Toasts, { mapStateToProps } from '../Toasts'
import Toast from '../Toast'

const { keys } = Object
const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => state
})

describe('components/Toasts.js', () => {
  const store = storeFake({
    toasts: {
      1: {
        text: 'I\'m a toast'
      }
    }
  })
  const state = store.getState()
  it('should render a list of toast', () => {
    const shallowToasts = shallow(
      <Toasts store={store} />
    ).dive()

    expect(shallowToasts.hasClass('toasts-container')).to.be.true
    expect(shallowToasts.find(Toast)).to.be.length(keys(state.toasts).length)
  })
  it('should return the list of toasts', () => {
    const props = mapStateToProps(state)

    expect(props).to.be.deep.equal({
      toasts: {
        1: {
          text: 'I\'m a toast'
        }
      }
    })
  })
})
