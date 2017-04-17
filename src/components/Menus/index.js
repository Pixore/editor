import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { register } from 'react-dynamic-layout'

import Name from './Name'
import Proyect from './Project'
import Menu from '../Menu'
import { noopF } from '../../utils/noop'
import * as events from './events'

import {
  saveEditor,
  setSpriteId,
  putName
} from '../../ducks'

const obj = Object.assign({}, events)

obj.displayName = 'Menus'

obj.propTypes = {
  sprite: PropTypes.object,
  spriteId: PropTypes.string
}

obj.getInitialState = function () {
  return {
    style: {
      top: 0,
      left: 0,
      width: '100%',
      height: '25px'
    }
  }
}

obj.getName = function () {
  if (this.props.sprite) {
    return this.props.sprite.name
  }
  return ''
}

let menuCount = -1
obj.getMenu = function (name = 'menu unname', handle = noopF, children = []) {
  menuCount++
  return <li key={menuCount} className={'menu ' + name.toLowerCase().replace(/ /g, '-')} onClick={handle}>
    {name}
    {
      children.length === 0 ? '' : <ul className='list-menus'>
        {children}
      </ul>
    }
  </li>
}
obj.shouldComponentUpdate = function (nextProps) {
  return nextProps.spriteId !== this.props.spriteId
}

obj.onSubmitName = function (name) {
  console.log(this.props.putName(this.props.sprite, name))
}

obj.openNewSpriteModal = function () {
  this.props.rdOpenFloat(this.props.modalNewSpriteId)
}

obj.render = function () {
  return <div className='header' >
    <a href='/'>
      <image className='logo' />
    </a>
    <Menu active inline>
      <Proyect openNewSpriteModal={this.openNewSpriteModal} />
      <Menu child>
        Sprite
        <li onClick={this.onResize}>resize</li>
        <li onClick={this.onSetBackground}>set background</li>
      </Menu>
    </Menu>
    <Name name={this.getName()} onSubmit={this.onSubmitName} />
  </div>
}

function mapStateToProps (state) {
  return {
    frames: state.frames,
    layers: state.layers,
    spriteId: state.editor.sprite,
    sprite: state.sprites[state.editor.sprite],
    user: state.user
  }
}

const Menus = connect(
  mapStateToProps,
  {setSpriteId, saveEditor, putName}
)(React.createClass(obj))

register(Menus, obj.displayName)

export default Menus
