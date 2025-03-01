import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import store from '@/redux/store';

import './index.css';

// Configure NProgress globally
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200
});

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
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
} else {
  console.error('Root element not found');
}