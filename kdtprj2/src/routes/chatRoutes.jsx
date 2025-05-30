import React from "react";
import { Route } from "react-router-dom";
import ChatPage from "../pages/chat/ChatPage";
import ItemDetailPage from "../pages/main/itemDetail/ItemDetailPage";
import ChatListPage from "../pages/main/chatList/ChatListPage.jsx";

const ChatRoutes = (
  <>
    <Route path="/item/:id" element={<ItemDetailPage />} />
    <Route path="/chat" element={<ChatPage />} />,
    <Route path="/chatList" element={<ChatListPage />} />,
  </>
);

export default ChatRoutes;
