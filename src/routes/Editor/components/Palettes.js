import React from 'react'

import Panel from './Panel'

const obj = {}
obj.displayName = 'Palettes'

obj.getInitialState = function () {
  return {
    style: {
      top: '100px',
      left: '400px',
      visibility: 'hidden'
    }
  }
}

obj.render = function () {
  return <Panel name='Palettes' style={this.state.style} />
}

const Palettes = React.createClass(obj)

export default Palettes
