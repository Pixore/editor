
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Tooltipy } from '../Tooltipy'

export default class ToolButton extends Component {
  static defaultProps = {
    active: false
  }

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.name !== this.props.name ||
      nextProps.active !== this.props.active
  }
  onClick = () => {
    this.props.onClick(this.props.name)
  }
  render () {
    return (
      <Tooltipy text={this.props.name} mode='top'>
        <button
          onClick={this.onClick}
          className={this.props.active ? 'active' : ''} >
          {this.props.name.slice(0, 1) }
        </button>
      </Tooltipy>
    )
  }
}
