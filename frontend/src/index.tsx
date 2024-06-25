import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthCallback from './components/AuthCallback';

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/auth/outlook/callback" element={<AuthCallback />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}
