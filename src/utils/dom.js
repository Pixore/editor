import Selector from './Selector'
import AppendObject from './AppendObject'
import createDebug from 'debug'

const debug = createDebug()
// Returns true if it is a DOM node
export const isNode = function (obj) {
  return (
    typeof Node === 'object'
      ? obj instanceof Node
      : obj &&
        typeof obj === 'object' &&
        typeof obj.nodeType === 'number' &&
        typeof obj.nodeName === 'string'
  )
}

// Returns true if it is a DOM element
export const isElement = function (obj) {
  return (
    typeof HTMLElement === 'object'
      ? obj instanceof HTMLElement
      : obj &&
        typeof obj === 'object' &&
        obj !== null &&
        obj.nodeType === 1 &&
        typeof obj.nodeName === 'string'
  )
}

// function createProp(name, ob, val) {
//   if (hasVal(ob[name])) {
//     return
//   }
//   Object.defineProperty(ob, name, {
//     value: val,
//     enumerable: false
//   })
// }
export const $ = function () {
  if (arguments.length === 0) {
    return
  }
  if (arguments[0] instanceof Selector) {
    return arguments[0]
  }
  const params = arguments
  if (params[0] instanceof Element || params[0] === window) {
    return new Selector(params[0])
  } else if (params[0] instanceof AppendObject) {
    return new Selector(params[0].el)
  } else if (typeof params[0] === 'string') {
    const selector = params[0].trim()
    let element
    let simple = true

    simple = selector.indexOf(' ') !== -1 && simple
    simple = selector.split('.').length > 1 && simple
    simple = selector.indexOf('>') !== -1 && simple
    simple = selector.indexOf(',') !== -1 && simple

    if (simple) {
      if (selector.indexOf('#') !== -1) {
        element = document.getElementById(selector.replace('#', ''))
      } else if (selector.indexOf('.') !== -1) {
        element = document.getElementsByClassName(selector.replace('.', ''))
        debug(element, selector)
      }
    } else {
      debug('query select')
    }
    return new Selector(element)
  }
}
