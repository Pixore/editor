import { expect } from 'chai'
import { createSprite } from './sprites'
import { store } from '../store'
import createDebug from 'debug'

const debug = createDebug()

describe('utils sprite', function () {
  it('use all default params', function () {
    createSprite()
    const state = store.getState()
    debug(
      state.Editor.sprites
    )
    debug(
      state.Editor.frames[0]
    )
    debug(
      state.Editor.layers[0]
    )
    debug(
      state.sprites[0]
    )
    expect(true).to.be.true
  })
})
