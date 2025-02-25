import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import store from '@/redux/store.ts';

import './index.css';
import AnimatedFaviconLoader from './components/AnimatedFaviconLoader.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <HelmetProvider>
          {/* Wrap the entire App in Suspense */}
          <Suspense fallback={<AnimatedFaviconLoader />}>
            <App />
          </Suspense>
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
