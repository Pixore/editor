import React from 'react'
import PropTypes from 'prop-types'
import { Tooltipy } from '../Tooltipy'
const obj = {}

obj.displayName = 'Name'

obj.propTypes = {
  name: PropTypes.string,
  onSubmit: PropTypes.func
}

obj.onSubmit = function (evt) {
  evt.preventDefault()
  if (this.state.name !== this.props.name) {
    this.props.onSubmit(this.state.name)
  }
}
obj.shouldComponentUpdate = function (nextProps, nextState) {
  return nextProps.name !== this.props.name || nextState.name !== this.state.name
}

obj.getInitialState = function () {
  return {
    name: this.props.name
  }
}

obj.componentWillReceiveProps = function (nextProps) {
  if (this.props.name !== nextProps.name) {
    this.setState({
      name: nextProps.name
    })
  }
}

obj.onChange = function (evt) {
  this.setState({
    name: evt.target.value
  })
}

obj.render = function () {
  return <form onSubmit={this.onSubmit} className='name-form'>
    <Tooltipy text='blyat?' mode='bottom'>
      <input className='name-sprite' onBlur={this.onSubmit} onChange={this.onChange} value={this.state.name} />
    </Tooltipy>
    <button type='submit'>submit</button>
  </form>
}

const Name = React.createClass(obj)

export default Name
