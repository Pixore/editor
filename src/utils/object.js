
export const defineGetter = function defineGetter (obj, name, fn) {
  Object.defineProperty(obj, name, {
    get: fn,
    enumerable: true,
    configurable: true
  })
}

export const extend = function extend (destination, source) {
  for (const prop in source) {
    if (source.hasOwnProperty(prop)) {
      destination[prop] = source[prop]
    }
  }
  return destination
}

export const inheritanceObject = function (child, father) {
  child.prototype = Object.create(father.prototype)
  child.prototype.constructor = child
}

export const bindObject = function (obj, self) {
  self = self || obj
  const keys = Object.keys(obj)
  for (let j = 0; j < keys.length; j++) {
    const prop = keys[j]
    if (typeof obj[prop] === 'function') {
      obj[prop] = obj[prop].bind(self)
    }
  }
}
