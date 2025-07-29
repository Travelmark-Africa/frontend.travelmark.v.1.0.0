import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import store from '@/redux/store';

import 'nprogress/nprogress.css';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        theme='light'
        toastOptions={{
          style: {
            background: 'white',
          },
          classNames: {
            success: '[&_div]:text-green-600',
            error: '[&_div]:text-red-600',
            warning: '[&_div]:text-yellow-600',
            info: '[&_div]:text-blue-600',
          },
        }}
      />
    </Provider>
  </React.StrictMode>
);
