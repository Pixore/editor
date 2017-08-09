import { expect } from 'chai'
import duck, { addToast, removeToast, updateToast } from '../toasts'
import freeze from 'deep-freeze-node'
import _fixture from './toasts.fixture'
const { types, reducer } = duck

const initialState = freeze(duck.initialState)
const { addAction, removeAction, updateAction } = freeze(_fixture)

describe('ducks/toasts', () => {
  describe('initialState', () => {
    it('should an empty object', () => {
      expect(initialState).to.deep.equal({})
    })
  })

  describe('type names', () => {
    it('should be same value and name', () => {
      Object.keys(types).forEach(type => {
        expect(type === types[type]).to.be.true
      })
    })
  })

  describe('addToast', () => {
    it('should create a ADD_TOAST action', () => {
      const data = addAction.payload
      const action = addAction
      const result = addToast(data)

      expect(result).to.be.deep.equal(action)
    })
  })
  describe('removeToast', () => {
    it('should create a REMOVE_TOAST action', () => {
      const data = removeAction.payload
      const action = removeAction
      const result = removeToast(data)

      expect(result).to.be.deep.equal(action)
    })
  })
  describe('updateToast', () => {
    it('should create a UPDATE_TOAST action', () => {
      const id = updateAction.payload.id
      const data = updateAction.payload
      const action = updateAction
      const result = updateToast(id, data)

      expect(result).to.be.deep.equal(action)
    })
  })
  describe('reducer', () => {
    it('should add a new toast', () => {
      const newState = reducer(initialState, addAction)
      expect(newState).to.be.deep.equal({
        [addAction.payload.id]: addAction.payload
      })
    })
    it('should update toast', () => {
      const newState = reducer(initialState, updateAction)
      expect(newState).to.be.deep.equal({
        [updateAction.payload.id]: updateAction.payload
      })
    })
    it('should remove toast', () => {
      const newState = reducer({
        [addAction.payload.id]: addAction.payload
      }, removeAction)
      expect(newState).to.be.deep.equal({})
    })
  })
})
