import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Toast extends Component {
  static defaultProps = {
    title: '',
    icon: undefined
  }
  static propTypes = {
    bottom: PropTypes.number.isRequired,
    title: PropTypes.string,
    text: PropTypes.string.isRequired,
    icon: PropTypes.string
  }

  getBody () {
    if (this.props.title) {
      return (
        <div className='toast-body'>
          <div className='toast-title'>{this.props.title}</div>
          <div className='toast-text'>{this.props.text}</div>
        </div>
      )
    }
    return (
      <div className='toast-body'>
        <div className='toast-text'>{this.props.text}</div>
      </div>
    )
  }

  render () {
    return (
      <div className='toast' style={{bottom: this.props.bottom}}>
        {this.props.icon && <div className='toast-icon'>{this.props.icon}</div>}
        {this.getBody()}
      </div>
    )
  }
}
