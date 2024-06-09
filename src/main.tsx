import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Preloader from './components/Navigation/Preloader.tsx'
import { AppWrapper } from './wrappers/app';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<Preloader />}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </Suspense>
  </React.StrictMode>,
)
