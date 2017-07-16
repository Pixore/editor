import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { register } from 'react-dynamic-layout'

import ToolButton from './ToolButton'
import Colors from './Colors'

import {
  setCurrentTool
} from '../../ducks'

class Tools extends Component {
  static propTypes = {
    tools: PropTypes.array.isRequired,
    tool: PropTypes.string.isRequired,
    secondaryColor: PropTypes.string.isRequired,
    primaryColor: PropTypes.string.isRequired,
    sprite: PropTypes.string.isRequired,
    setCurrentTool: PropTypes.func.isRequired,
    rdOpenFloat: PropTypes.func.isRequired,
    rdChangeProps: PropTypes.func.isRequired,
    modalColorPickerId: PropTypes.string.isRequired,
    elementColorPickerId: PropTypes.string.isRequired
  }

  componentDidMount () {
    if (!this.props.tool) {
      this.props.setCurrentTool(this.props.tools[0])
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.tools.length !== this.props.tools.length ||
    nextProps.tool !== this.props.tool ||
    nextProps.secondaryColor !== this.props.secondaryColor ||
    nextProps.primaryColor !== this.props.primaryColor
  }

  onClickTool = (name) => {
    this.props.setCurrentTool(name)
  }

  onClickPrimary = (evt) => {
    evt.preventDefault()
    this.props.rdChangeProps(
      this.props.elementColorPickerId,
      {
        color: this.props.primaryColor,
        action: 'setSpritePrimaryColor',
        sprite: this.props.sprite
      }
    )
    this.props.rdOpenFloat(this.props.modalColorPickerId)
  }
  onClickSecondary = (evt) => {
    evt.preventDefault()
    this.props.rdChangeProps(
      this.props.elementColorPickerId,
      {
        color: this.props.secondaryColor,
        action: 'setSpriteSecondaryColor',
        sprite: this.props.sprite
      }
    )
    this.props.rdOpenFloat(this.props.modalColorPickerId)
  }

  render = function () {
    return (
      <div className='panel-tools'>
        <Colors
          onClickSecondary={this.onClickSecondary}
          onClickPrimary={this.onClickPrimary}
          primaryColor={this.props.primaryColor}
          secondaryColor={this.props.secondaryColor} />
        <div className='tools'>
          {
            this.props.tools.map((item, index) => (
              <ToolButton
                onClick={this.onClickTool}
                active={this.props.tool === item}
                name={item}
                key={index} />
            ))
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const sprite = state.sprites[state.editor.sprite]
  return {
    sprite: sprite.id,
    tools: state.editor.tools,
    tool: state.editor.tool,
    primaryColor: sprite.primaryColor,
    secondaryColor: sprite.secondaryColor
  }
}

const ToolsConnect = connect(
  mapStateToProps,
  {setCurrentTool}
)(Tools)

register(ToolsConnect, 'Tools')

export default ToolsConnect
