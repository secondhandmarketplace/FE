import React from "react";
import styles from "./purchaseItems.module.css";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import ItemCard from "../../../components/ItemCard/ItemCard.jsx";

function PurchaseItemsPage() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles["purchase-box"]}>
        <p> 구매 목록</p>
        <div>
            <ItemCard />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PurchaseItemsPage;
