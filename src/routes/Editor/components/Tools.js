import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { register } from 'react-dynamic-layout'
import { Tooltipy } from '../../../components/Tooltipy'
import Color from './Color'
import {
  setCurrentTool
} from '../../../ducks'

const obj = {}

obj.displayName = 'Tools'

obj.propTypes = {
  tools: PropTypes.array,
  tool: PropTypes.string,
  secondaryColor: PropTypes.string,
  primaryColor: PropTypes.string,
  sprite: PropTypes.string
}

obj.componentDidMount = function () {
  if (!this.props.tool) {
    this.props.setCurrentTool(this.props.tools[0])
  }
}

obj.shouldComponentUpdate = function (nextProps) {
  return nextProps.tools.length !== this.props.tools.length ||
  nextProps.tool !== this.props.tool ||
  nextProps.secondaryColor !== this.props.secondaryColor ||
  nextProps.primaryColor !== this.props.primaryColor
}
obj.onClickPrimary = function (evt) {
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

obj.onClickSecondary = function (evt) {
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

obj.onClickTool = function (name) {
  this.props.setCurrentTool(name)
}

obj.render = function () {
  return (
    <div className='panel-tools'>
      <div className='colors'>
        <Color
          onClick={this.onClickSecondary}
          color={this.props.secondaryColor}
          size={35}
          className={'secondary'} />
        <Color
          onClick={this.onClickPrimary}
          color={this.props.primaryColor}
          size={35}
          className={'primary'} />
      </div>
      <div className='tools'>
        {
          this.props.tools.map((item, index) => <ToolButton onClick={this.onClickTool} name={item} key={index} />)
        }
      </div>
    </div>
  )
}

class ToolButton extends React.Component {
  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
  }
  shouldComponentUpdate (nextProps) {
    return nextProps.name !== this.props.name ||
      nextProps.active !== this.props.active
  }
  onClick () {
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

ToolButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool
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

const Tools = connect(
  mapStateToProps,
  {setCurrentTool}
)(React.createClass(obj))

register(Tools, obj.displayName)

export default Tools
