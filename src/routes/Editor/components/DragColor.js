
import React from 'react'
import PropTypes from 'prop-types'
import { LEFT_CLICK } from '../../../constants/index'
import createDebug from 'debug'

const debug = createDebug()

const obj = {}

obj.displayName = 'DragColor'

obj.propTypes = {
  index: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  onSelectColor: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired,
  color: PropTypes.string.isRequired
}

obj.onMouseDown = function () {
  debug('onMouseDown color')
  // var name = this.props.name.replace(' ', '')
  // var stats = evt.target.getBoundingClientRect()
  // var diffX = evt.clientX - stats.left
  // var diffY = evt.clientY - stats.top
  // var maxLeft = window.innerWidth - evt.target.clientWidth
  // var maxTop = window.innerHeight - evt.target.clientHeight
  // $window.on('mousemove.drag', evt => {
  //   let top = evt.clientY - diffY
  //   let left = evt.clientX - diffX
  //   if (top < 25) {
  //     top = 25
  //   }
  //   if (left < 0) {
  //     left = 0
  //   }
  //   if (left > maxLeft) {
  //     left = maxLeft
  //   }
  //   if (top > maxTop) {
  //     top = maxTop
  //   }
  //   this.setState({
  //     style : Object.assign({}, this.state.style,{
  //       top,
  //       left
  //     })
  //   })
  // }).on('mouseup.drag', evt => {
  //   $window.off('mousemove.drag').off('mouseup.drag')
  // })
}

obj.onClick = function (evt) {
  this.props.onSelectColor(this.props.color, evt.nativeEvent.which === LEFT_CLICK)
}

obj.render = function () {
  var styleBackground = {
    width: this.props.size,
    height: this.props.size,
    top: this.props.position.y * this.props.size,
    left: this.props.position.x * this.props.size
  }
  var styleColor = {
    background: this.props.color,
    width: this.props.size,
    height: this.props.size
  }
  return (<div className='drag-color transparent-bkg' style={styleBackground} onContextMenu={this.onClick}
    onClick={this.onClick} onMouseDown={this.onMouseDown}>
    <div style={styleColor} />
  </div>)
}

const Color = React.createClass(obj)

export default Color
