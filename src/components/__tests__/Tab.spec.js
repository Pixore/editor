import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Tab from '../Tab'
import sinon from 'sinon'

describe('components/Tab', () => {
  it('should render a tab', () => {
    const spyOnClick = sinon.spy()
    const spyOnClose = sinon.spy()
    const id = '1'
    const name = 'I\'m a tab'
    const shallowTab = shallow(
      <Tab
        id={id}
        onClick={spyOnClick}
        onClose={spyOnClose}
        name={name} />
    )

    expect(shallowTab.hasClass('rdl-tab')).to.be.true

    const shallowTabName = shallowTab.find('.rdl-tab-name')
    const shallowTabClose = shallowTab.find('.rdl-tab-close')

    expect(shallowTabName.text()).to.be.equal(name)

    shallowTabClose.simulate('click', {stopPropagation: () => ({})})
    expect(spyOnClose.withArgs(sinon.match.any, id).calledOnce).to.be.true

    shallowTab.simulate('click')
    expect(spyOnClick.withArgs(sinon.match.any, id).calledOnce).to.be.true
  })
})
