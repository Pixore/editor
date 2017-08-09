import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Toast from './Toast'

const baseBottom = 50
const margin = 10

class Toasts extends Component {
  static propTypes = {
    toasts: PropTypes.object.isRequired
  }

  getToasts () {
    return Object.keys(this.props.toasts).reverse().map((toast, index) => {
      return (
        <Toast bottom={(index * (baseBottom + margin)) + 50} key={index} {...this.props.toasts[toast]} />
      )
    })
  }

  render () {
    return (
      <div className='toasts-container'>
        {this.getToasts()}
      </div>
    )
  }
}

export function mapStateToProps (state) {
  return {
    toasts: state.toasts
  }
}

export default connect(mapStateToProps)(Toasts)
