// @flow

import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'

/**
 * Separate reducer file is required for hot reloading
 */

const rootReducer = combineReducers({
  form,
})

export default rootReducer
