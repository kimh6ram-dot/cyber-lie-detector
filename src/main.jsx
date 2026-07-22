import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import './styles/animations.css'
import './styles/screens.css'

// SPA 진입점: 단일 페이지 안에서 화면 전환(App)이 이루어진다.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
