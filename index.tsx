import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './services/i18n'; // Initialize i18n

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Failed to find root element");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Error mounting React application:", error);
  rootElement.innerHTML = '<div style="padding: 20px; color: red;">Application failed to load. Check console for details.</div>';
}