import React from "react";
import { Route } from "react-router-dom";
import ViewedItemsPage from "../pages/history/viewedItems/ViewedItemsPage.jsx";
import LikedItemsPage from "../pages/history/likedItems/LikedItemsPage.jsx";
import TransactionsPage from "../pages/history/transaction/transactionsPage.jsx";
import SalesItemsPage from "../pages/history/salesItems/SalesItemsPage.jsx";

const historyRoutes = (
    <>
        <Route path= "/history/sales" element={<SalesItemsPage />}/>
        <Route path="/history/viewed" element={<ViewedItemsPage />} />
        <Route path="/history/liked" element={<LikedItemsPage />} />
        <Route path="/history/transactions" element={<TransactionsPage />} />

    </>
)

export default historyRoutes;