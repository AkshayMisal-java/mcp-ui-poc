import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import Home from './home';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
     <BrowserRouter>
      <Home />
    </BrowserRouter>
  </React.StrictMode>,
);