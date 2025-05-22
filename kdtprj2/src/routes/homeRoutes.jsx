import React from "react";
import {Route} from "react-router-dom";
import HomePage from "../pages/main/home/HomePage.jsx";
// import AiChatPage from "../pages/main/AiChatPage";
import RegisterPage from "../pages/main/register/RegisterPage";
import ItemDetailPage from "../pages/main/ItemDetail/ItemDetailPage";
// import MyPage from "../pages/main/MyPage";
// import ChatListPage from "../pages/main/ChatListPage";

const homeRoutes = (
    <>
        <Route path="/home" element={<HomePage/>}/>
        {/*<Route path="/ai" element={<AiChatPage/>}/>*/}
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/item/:id" element={<ItemDetailPage/>}/>
        {/*<Route path="/mypage" element={<MyPage/>}/>*/}
        {/*<Route path="/chatlist" element={<ChatListPage/>}/>*/}
    </>
);

export default homeRoutes;