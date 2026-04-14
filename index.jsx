import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 這是 React 專案的「起點」
// 它會找到 HTML 裡 id 為 'root' 的地方，並把我們寫的 App 內容渲染進去
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)