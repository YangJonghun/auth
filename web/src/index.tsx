import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';

import initStore from './store/config';
import CustomApolloProvider from './lib/CustomApolloProvider';

const store = initStore();

ReactDOM.render(
  <Provider store={store}>
    <CustomApolloProvider>
      <App />
    </CustomApolloProvider>
  </Provider>,
  document.getElementById('root'),
);
