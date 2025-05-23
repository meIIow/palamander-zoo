import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// import Exhibit from './../exhibit/Exhibit.tsx'

(async () => {
  const response = await chrome.runtime.sendMessage({ greeting: 'hello' });
  // do something with response here, not outside the function
  console.log(response);
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
