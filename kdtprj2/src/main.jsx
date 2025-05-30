import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import LoginRoutes from "./routes/loginRoutes.jsx";
import homeRoutes from "./routes/homeRoutes.jsx";
import ChatRoutes from "./routes/chatRoutes.jsx";
import historyRoutes from "./routes/historyRoutes.jsx";
import searchRoutes from "./routes/searchRoutes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {LoginRoutes}
          {homeRoutes}
          {ChatRoutes}
          {historyRoutes}
          {searchRoutes}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
