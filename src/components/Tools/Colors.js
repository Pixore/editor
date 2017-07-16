import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Color from '../../routes/Editor/components/Color'

export default class Colors extends Component {
  render () {
    return (
      <div className='colors'>
        <Color
          onClick={this.props.onClickSecondary}
          color={this.props.secondaryColor}
          size={35}
          className='secondary' />
        <Color
          onClick={this.props.onClickPrimary}
          color={this.props.primaryColor}
          size={35}
          className='primary' />
      </div>
    )
  }
}

Colors.propTypes = {
  onClickSecondary: PropTypes.func.isRequired,
  onClickPrimary: PropTypes.func.isRequired,
  secondaryColor: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired
}
