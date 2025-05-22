import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import LoginRoutes from './routes/loginRoutes.jsx'
import homeRoutes from './routes/homeRoutes.jsx'
import ChatRoutes from './routes/chatRoutes.jsx'
// import ProfileRoute from './routes/profileRoutes.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    {LoginRoutes}
                    {homeRoutes}
                    {ChatRoutes}
                    {/*{ProfileRoute}*/}
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);