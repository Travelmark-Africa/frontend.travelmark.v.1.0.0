import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import store from '@/redux/store';

import 'nprogress/nprogress.css';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
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
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
