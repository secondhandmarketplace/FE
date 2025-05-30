import React from "react";
import { Route } from "react-router-dom";
import ViewedItemsPage from "../pages/history/viewedItems/ViewedItemsPage.jsx";
import LikedItemsPage from "../pages/history/likedItems/LikedItemsPage.jsx";
import SalesItemsPage from "../pages/history/salesItems/SalesItemsPage.jsx";
import PurchaseItemsPage from "../pages/history/purchaseItems/PurchaseItemsPage.jsx";

const historyRoutes = (
    <>
        <Route path= "/history/sales" element={<SalesItemsPage />}/>
        <Route path="/history/viewed" element={<ViewedItemsPage />} />
        <Route path="/history/liked" element={<LikedItemsPage />} />
        <Route path="/history/purchased" element={<PurchaseItemsPage />} />

    </>
)

export default historyRoutes;