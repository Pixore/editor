
import React from 'react'
import ReactDOM from 'react-dom'

import { imageSmoothingDisabled, clean } from '../../../utils/canvas'

const obj = {}
obj.displayName = 'Context'

obj.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  image: React.PropTypes.object.isRequired
}

obj.getInitialState = function () {
  return {}
}
obj.getInitialProps = function () {
  return {
    className: ''
  }
}

obj.componentDidMount = function () {
  let context = ReactDOM.findDOMNode(this).getContext('2d')
  this.setState({
    context: context
  })
  this.initContext(this.props)
}
obj.initContext = function (props) {
  if (!this.state.context) {
    return
  }
  if (props.image) {
    this.paint(props.image.canvas ? props.image.canvas : props.image)
  }
}
obj.shouldComponentUpdate = function (nextProps, nextState) {
  if (this.props.version !== nextProps.version) {
    this.paint(this.props.image.canvas)
  }
  return this.props.width !== nextProps.width ||
    this.props.height !== nextProps.height ||
    this.props.image !== nextProps.image ||
    this.props.style !== nextProps.style ||
    this.state.context !== nextState.context
}
obj.paint = function (image) {
  var context = this.state.context
  clean(context)
  imageSmoothingDisabled(context)
  context.drawImage(image,
    0, 0, image.width, image.height,
    0, 0, this.props.width, this.props.height
  )
}
obj.componentDidUpdate = function () {
  this.initContext(this.props)
}
obj.render = function () {
  return <canvas
    className={this.props.className}
    style={this.props.style}
    height={this.props.height}
    width={this.props.width} />
}

const Context = React.createClass(obj)

export default Context
