import { createRoot } from 'react-dom/client'
import './index.css'
// import AppRouter from './router/AppRouter.jsx';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
     <BrowserRouter>
       <App />
     </BrowserRouter>
);
