// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';

import 'nprogress/nprogress.css';
import './index.css';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
      {/* React Query Devtools - only shows in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);