import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {UserProvider} from "./context/UserContext.jsx";
import {VegetableProvider} from "./context/VegetableContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <VegetableProvider>
      <App />
      </VegetableProvider>
    </UserProvider>
  </StrictMode>,
)
