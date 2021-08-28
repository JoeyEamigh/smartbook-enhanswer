import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './popup.scss';
import App from './App';
import { Provider } from 'react-redux';
import { reducers } from '../state/reducers';
import storeCreatorFactory from 'reduxed-chrome-storage';
import { applyMiddleware, createStore } from 'redux';
import { crashReporter, logger } from '../state/middleware';
import thunk from 'redux-thunk';

(async () => {
  const store = await storeCreatorFactory({ createStore })(reducers, applyMiddleware(logger, crashReporter, thunk));

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
})();
