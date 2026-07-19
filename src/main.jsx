import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// After a deploy, cached HTML can reference chunk files that no longer exist,
// leaving a blank page. Vite fires vite:preloadError when that happens —
// reload once to pick up the fresh build (sessionStorage guard avoids a loop).
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  if (!sessionStorage.getItem('chunk-reload')) {
    sessionStorage.setItem('chunk-reload', '1')
    window.location.reload()
  }
})
window.addEventListener('load', () => sessionStorage.removeItem('chunk-reload'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
