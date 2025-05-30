import React from "react";
import { Route } from "react-router-dom";
import LoginPage from "../pages/lending/login/loginPage.jsx";
import SignupPage from "../pages/lending/signup/SignupPage.jsx";
import ForgotPassword from "../pages/lending/forgot/ForgotPassword.jsx";

const LoginRoutes = (
  <>
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignupPage />} />
    <Route path="forgot" element={<ForgotPassword />} />
  </>
);

export default LoginRoutes;
