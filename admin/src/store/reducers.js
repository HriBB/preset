// @flow

import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'

import { reducer as app } from 'components/App'

/**
 * Separate reducer file is required for hot reloading
 */

const rootReducer = combineReducers({
  form,
  app,
})

export default rootReducer
