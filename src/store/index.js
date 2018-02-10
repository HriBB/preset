// @flow

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './reducers'

export default function configureStore(initialState: any) {
  const middleware = applyMiddleware(thunk)
  
  const devTools = (
    window.__REDUX_DEVTOOLS_EXTENSION__ && 
    window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  
  const enhancer = devTools ? compose(middleware, devTools) : middleware

  const store = createStore(rootReducer, initialState, enhancer)

  if (module.hot && typeof module.hot.accept === 'function') {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }
  
  return store
}
