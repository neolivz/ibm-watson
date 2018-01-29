import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import rootReducer from '../reducers/reducers'
import thunk from 'redux-thunk'

export function configureStore (initialState) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  const createStoreWithMiddleware = applyMiddleware(logger, thunk)(create)

  const store = createStoreWithMiddleware(rootReducer, initialState)

  return store
}
