import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

(async () => {
  const response = await chrome.runtime.sendMessage({greeting: "hello"});
  // do something with response here, not outside the function
  console.log(response);
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)