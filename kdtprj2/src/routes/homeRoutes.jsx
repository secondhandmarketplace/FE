import React from "react";
import { Route } from "react-router-dom";
import HomePage from "../pages/main/home/HomePage.jsx";
// import AiChatPage from "../pages/main/AiChatPage";
import RegisterPage from "../pages/main/register/RegisterPage";
import MyPage from "../pages/main/myPage/MyPage.jsx";

const homeRoutes = (
  <>
    <Route path="/home" element={<HomePage />} />
    {/*<Route path="/ai" element={<AiChatPage/>}/>*/}
    <Route path="/register" element={<RegisterPage />} />
    <Route path="mypage" element={<MyPage />} />
  </>
);

export default homeRoutes;
