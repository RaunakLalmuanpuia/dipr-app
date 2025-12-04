import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './context/AuthProvider.jsx'
import ThemeCustomization from '../src/themes';
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <ThemeCustomization>
              <AuthProvider>
                  <Routes>
                      <Route path="/*" element={<App />} />
                  </Routes>
              </AuthProvider>
          </ThemeCustomization>
      </BrowserRouter>
  </StrictMode>,
)
