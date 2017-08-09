import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Toast from '../Toast'

describe('components/Toast', () => {
  it('should render a toast', () => {
    const text = 'I\'m a toast'
    const shallowToast = shallow(
      <Toast bottom={10} text={text} />
    )
    expect(shallowToast.prop('style')).deep.equal({
      bottom: 10
    })
    expect(shallowToast.hasClass('toast')).to.be.true

    const shallowToastBody = shallowToast.find('.toast-body')
    const shallowToastIcon = shallowToast.find('.toast-icon')
    const shallowToastTitle = shallowToastBody.find('.toat-title')
    const shallowToastText = shallowToastBody.find('.toast-text')

    expect(shallowToastText.text()).to.be.equal(text)

    expect(shallowToastTitle.length).to.be.equal(0)
    expect(shallowToastIcon.length).to.be.equal(0)
  })
  it('should render a toast with a title', () => {
    const text = 'I\'m a toast'
    const title = 'I\'m a toast title'
    const shallowToast = shallow(
      <Toast bottom={10} title={title} text={text} />
    )

    const shallowToastTitle = shallowToast.find('.toast-title')

    expect(shallowToastTitle.hasClass('toast-title')).to.be.true
    expect(shallowToastTitle.text()).to.be.equal(title)
  })
})
