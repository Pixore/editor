import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
const obj = {}
obj.displayName = 'Menu'

obj.getDefaultProps = function () {
  return {
    child: false,
    position: {
      x: 0,
      y: 0
    }
  }
}

obj.propTypes = {
  child: PropTypes.bool,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  inline: PropTypes.bool,
  active: PropTypes.bool
  // children: function (props, propName, componentName) {
  //   var prop = props[propName]
  //   if (Array.isArray(prop)) {
  //     for (var i = 0; i < prop.length; i++) {
  //       var element = prop[i]
  //       if (typeof element.type === 'function' && element.type.displayName !== 'Menu') {
  //         return getError(element.type)
  //       } else if (typeof element.type === 'string' && element.type !== 'li') {
  //         return getError(element.type)
  //       }
  //     }
  //   } else {
  //     if (typeof prop.type === 'function' && prop.type.displayName !== 'Menu') {
  //       return getError(prop.type)
  //     } else if (typeof prop.type === 'string' && prop.type !== 'li') {
  //       return getError(prop.type)
  //     }
  //   }
  //   function getError () {
  //     return new Error(`${componentName} should have a single child of the following types: 'li, Menu'`)
  //   }
  // }
}
obj.render = function () {
  if (this.props.child) {
    return <li>
      {this.props.children[0]}
      <ul className='menu'>{React.Children.toArray(this.props.children).slice(1)}</ul>
    </li>
  }
  let style = {
    top: this.props.position.y,
    left: this.props.position.x
  }
  let className = classNames(
    'content-menu',
    { 'inline': this.props.inline,
      'hidden': !this.props.active }
  )
  return <div className={className} style={style} >
    <ul className='menu main'>
      {this.props.children}
    </ul>
  </div>
}

const Menu = React.createClass(obj)

export default Menu
