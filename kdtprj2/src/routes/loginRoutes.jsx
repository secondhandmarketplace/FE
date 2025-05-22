import React from 'react';
import { Route } from 'react-router-dom';
import LoginPage from '../pages/login/loginPage';
import SignupPage from '../pages/login/signup/signupPage.jsx';
import ForgotPassword from '../pages/login/forgot/ForgotPassword.jsx';

const LoginRoutes = (
    <>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot" element={<ForgotPassword />} />
    </>
    );

export default LoginRoutes;

