import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import Colors from '../Colors'
import Color from '../../../routes/Editor/components/Color'

describe('/components/Tools/Colors', () => {
  const onClickSecondarySpy = sinon.spy()
  const onClickPrimarySpy = sinon.spy()
  const shallowColors = shallow(
    <Colors
      secondaryColor='#fff'
      primaryColor='#000'
      onClickSecondary={onClickSecondarySpy}
      onClickPrimary={onClickPrimarySpy} />
  )

  it('should render', () => {
    expect(shallowColors.prop('className')).to.be.equal('colors')
    expect(shallowColors.find(Color).length).to.be.equal(2)
  })

  it('should call the functions', () => {
    shallowColors.find('.secondary').simulate('click')
    shallowColors.find('.primary').simulate('click')

    expect(onClickPrimarySpy.called).to.be.true
    expect(onClickSecondarySpy.called).to.be.true
  })
})
