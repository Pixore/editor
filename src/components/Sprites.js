import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { register } from 'react-dynamic-layout'
import { connect } from 'react-redux'
import classNames from 'classnames'
import createDebug from 'debug'

import {
  setEditorId,
  selectSpriteLayer,
  selectSpriteFrame,
  setCurrentSprite,
  closeSprite
} from '../ducks'

import http from '../utils/http'
import Tab from './Tab'

const debug = createDebug()

class Sprites extends Component {
  static defaultProps = {
    className: '',
    editorId: undefined
  }

  static propTypes = {
    className: PropTypes.string,
    sprites: PropTypes.object.isRequired,
    editorId: PropTypes.string,
    sprite: PropTypes.string.isRequired,
    filter: PropTypes.array.isRequired,
    selectSpriteFrame: PropTypes.func.isRequired,
    selectSpriteLayer: PropTypes.func.isRequired,
    setCurrentSprite: PropTypes.func.isRequired,
    setEditorId: PropTypes.func.isRequired,
    closeSprite: PropTypes.func.isRequired
  }

  onClickTab = (evt, sprite) => {
    this.props.selectSpriteFrame(sprite, this.props.sprites[sprite].frames[0])
    this.props.selectSpriteLayer(sprite, 0)
    this.props.setCurrentSprite(sprite)
  }

  onClose = (evt, sprite) => {
    // TODO: figure out what happen when there is no more sprites
    const nextSprite = this.props.filter.find(item => item !== sprite)

    this.props.selectSpriteFrame(nextSprite, this.props.sprites[nextSprite].frames[0])
    this.props.selectSpriteLayer(nextSprite, 0)
    this.props.setCurrentSprite(nextSprite)

    this.props.closeSprite(sprite)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.filter.length !== this.props.filter.length) {
      const sprites = this.props.filter
        .filter(index => !!this.props.sprites[index]._id)
        .map(index => this.props.sprites[index]._id)
      if (this.props.editorId) {
        http.put('/api/editor/' + this.props.editorId, {
          sprites
        })
      } else {
        http.post('/api/editor/', {
          sprites
        }).then(id => this.props.setEditorId(id)).catch(debug)
      }
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.filter.length !== this.props.filter.length ||
      nextProps.sprites !== this.props.sprites ||
      nextProps.sprite !== this.props.sprite ||
      nextProps.editorId !== this.props.editorId
  }

  getTabs = () => this.props.filter.map((key, index) => {
    const sprite = this.props.sprites[key]
    window.console.log(sprite)
    return (
      <Tab
        key={index}
        id={sprite.id}
        name={sprite.name}
        onClick={this.onClickTab}
        onClose={this.onClose}
        isNew={!sprite._id}
        isActive={sprite.id === this.props.sprite} />
    )
  })

  render () {
    const divClassName = classNames(
      'rdl-tabs',
      this.props.className
    )
    const style = {
      height: '100%'
    }
    return (
      <div style={style} className={divClassName}>
        {this.getTabs()}
      </div>
    )
  }
}

export function mapStateToProps (state) {
  return {
    filter: state.editorSprites,
    editorId: state.editor._id,
    sprites: state.sprites,
    sprite: state.editor.sprite
  }
}

const ConnectSprites = connect(
  mapStateToProps,
  Object.assign({}, {setEditorId, selectSpriteLayer, selectSpriteFrame, setCurrentSprite, closeSprite})
)(Sprites)

register(ConnectSprites, Sprites.name)

export default ConnectSprites
