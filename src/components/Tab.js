import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class Toast extends Component {
  static defaultProps = {
    isActive: false,
    isNew: false
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    isNew: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  onClick = evt => this.props.onClick(evt, this.props.id)

  onClose = evt => {
    evt.stopPropagation()
    this.props.onClose(evt, this.props.id)
  }

  render () {
    // TODO: remove inline style
    // TODO: add unsaved status
    // TODO: add saving status

    const className = classNames(
      'rdl-tab',
      this.props.name.replace(' ', '-').toLowerCase(),
      { 'active': this.props.isActive }
    )
    style.root.fontStyle = this.props.isNew ? 'italic' : ''
    return (
      <div
        style={style.root}
        className={className}
        onClick={this.onClick}>
        <div className='rdl-tab-name' style={style.text}>{this.props.name}</div>
        <button
          className='rdl-tab-close'
          onClick={this.onClose}
          style={style.button}>
          &times;
        </button>
      </div>
    )
  }
}

const style = {
  root: {
    'maxWidth': 150,
    'paddingRight': 15,
    'position': 'relative'
  },
  text: {
    'whiteSpace': 'nowrap',
    'textOverflow': 'ellipsis',
    'overflow': 'hidden',
    'paddingRight': 5
  },
  button: {
    'outline': 'none',
    'cursor': 'pointer',
    'top': 0,
    'right': 0,
    'textShadow': '0px 2px 0px rgba(0, 0, 0, 0.51)',
    'color': 'inherit',
    'fontWeight': 'bolder',
    'position': 'absolute',
    'background': 'transparent',
    'border': 0
  }
}
