import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { imageSmoothingDisabled, clean } from '../../../utils/canvas'
import { getContext } from '../../../constants'

const obj = {}
obj.displayName = 'Sprite'

obj.propTypes = {
  style: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  frames: PropTypes.object.isRequired,
  interval: PropTypes.number.isRequired,
  filter: PropTypes.array.isRequired
}

obj.render = function () {
  return (
    <canvas
      style={this.props.style}
      className='transparent-bkg'
      width={this.props.width}
      height={this.props.height} />
  )
}
obj.componentDidMount = function () {
  const context = ReactDOM.findDOMNode(this).getContext('2d')
  this.setState({
    context: context
  })
  if (this.props.frames && this.props.frames.length !== 0) {
    setTimeout(() => {
      this.initInterval(this.props, this.state)
    }, 500)
  }
}

obj.shouldComponentUpdate = function (nextProps, nextState) {
  const isNewWidth = this.props.width !== nextProps.width
  const isNewHeight = this.props.height !== nextProps.height

  const isNewInterval = this.props.interval !== nextProps.interval
  const isNewLength = this.props.filter.length !== nextProps.filter.length
  const update = isNewWidth || isNewHeight
  const reInit = !update && (isNewInterval || isNewLength)
  if (nextState.context && reInit) {
    this.index = 0
    setTimeout(() => {
      this.initInterval(nextProps, nextState)
    }, 500)
  } else if (!update && nextProps.filter.length === 1) {
    this.paint(nextState.context, getContext(nextProps.filter[0]).canvas)
  }
  return update
}
obj.initInterval = function (props, state) {
  if (props.filter.length > 1) {
    this.index = 0
    this.interval = clearInterval(this.interval)
    this.interval = setInterval(this.onInterval, props.interval)
  } else {
    this.paint(state.context, getContext(this.props.filter[0]).canvas)
  }
}

obj.onInterval = function () {
  this.paint(this.state.context, getContext(this.props.filter[this.index]).canvas)
  this.index++
  if (this.index > this.props.filter.length - 1) {
    this.index = 0
  }
}
obj.paint = function (context, frame) {
  clean(context.canvas)
  imageSmoothingDisabled(context)
  context.drawImage(frame,
    0, 0, frame.width, frame.height,
    0, 0, context.canvas.width, context.canvas.height
  )
}
const Sprite = React.createClass(obj)

export default Sprite
