import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

if (!domain || !clientId) {
  console.error('Missing Auth0 configuration. Please check your .env.local file.');
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain || 'genai-934194719980395.us.auth0.com'}
      clientId={clientId || 'QkPk3LipxEsLje1C3RovBSLjEjZA7wzl'}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience || 'https://api.spaceweb.org',
        scope: 'openid profile email offline_access',
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

