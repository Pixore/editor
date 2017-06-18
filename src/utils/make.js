import { isElement } from './dom.js'

// NOTE: code taken from http://stackoverflow.com/a/2947012/4394520 with a littles chages
export default function make (desc) {
  if (!Array.isArray(desc)) {
    return make.call(this, Array.prototype.slice.call(arguments))
  }

  const name = desc[0]
  let parent = false
  const attributes = desc[1]

  const el = typeof name === 'string' ? document.createElement(name) : name

  let start = 1
  if (typeof attributes === 'object' && attributes !== null && !Array.isArray(attributes) && !isElement(attributes)) {
    for (const attr in attributes) {
      if (attr === 'parent') {
        parent = true
      } else {
        el[attr] = attributes[attr]
      }
    }
    start = 2
  }

  for (let i = start; i < desc.length; i++) {
    if (isElement(desc[i])) {
      el.appendChild(desc[i])
    } else if (Array.isArray(desc[i])) {
      el.appendChild(make(desc[i]))
    } else {
      el.appendChild(document.createTextNode(desc[i]))
    }
  }
  if (parent) {
    attributes.parent.appendChild(el)
  }
  return el
}
