import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.tsx';
import {Provider} from 'react-redux';
import {store} from './store';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {TOAST_AUTO_CLOSE_TIME} from './const.ts';
import './polyfills';
import {userActions} from './store/slices/user.ts';
import {getToken} from './services/token.ts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

store.dispatch(userActions[getToken() ? 'checkAuth' : 'setNoAuthStatus']());

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastContainer
        position="top-center"
        autoClose={TOAST_AUTO_CLOSE_TIME}
        hideProgressBar
      />
      <App />
    </Provider>
  </React.StrictMode>
);
