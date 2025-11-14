import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')!
rootElement.innerHTML = ''

createRoot(rootElement).render(
    <App />
)
