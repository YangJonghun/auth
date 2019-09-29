import { createStore, applyMiddleware, Middleware } from 'redux';
import rootReducer from './modules';

const middlewares: Middleware[] = [];

if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');
  middlewares.push(createLogger());
}

const initStore = () =>
  createStore(rootReducer, applyMiddleware(...middlewares));

export default initStore;
