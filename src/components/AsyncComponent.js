import React from 'react'
import PropTypes from 'prop-types'

const obj = {}

obj.displayName = 'AsyncComponent'

obj.getInitialState = function () {
  return {}
}

obj.componentDidMount = function () {
  this.props.loader((component, props) => {
    this.setState({
      component,
      props
    })
  })
}

obj.renderPlaceholder = function () {
  return <div>Loading</div>
}

obj.render = function () {
  if (this.state.component) {
    return <this.state.component {...this.props} {...this.state.props} />
  }
  return (this.props.renderPlaceholder || this.renderPlaceholder)()
}

obj.propTypes = {
  loader: PropTypes.func.isRequired,
  renderPlaceholder: PropTypes.func
}

const AsyncComponent = React.createClass(obj)

export default AsyncComponent
