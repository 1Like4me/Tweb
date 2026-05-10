import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';
import { ToastProvider } from './context/ToastContext';
import { I18nProvider } from './i18n/i18n';
import { ChatProvider } from './context/ChatContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApiProvider>
        <I18nProvider>
          <AuthProvider>
            <ToastProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </ToastProvider>
          </AuthProvider>
        </I18nProvider>
      </ApiProvider>
    </BrowserRouter>
  </React.StrictMode>
);

