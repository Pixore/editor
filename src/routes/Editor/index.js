import React from 'react'
import AsyncComponent from '../../components/AsyncComponent'

import loader from './loader'
import createDebug from 'debug'

const debug = createDebug()

export default (props) => {
  debug(props)
  return <AsyncComponent {...props} loader={loader} />
}
