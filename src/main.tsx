import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import store from '@/redux/store.ts';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
        <Toaster
          toastOptions={{
            classNames: {
              error: 'text-red-600',
              success: 'text-green-600',
              warning: 'text-yellow-600',
              info: 'text-blue-600',
            },
          }}
        />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
