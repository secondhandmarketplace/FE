import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import styles from "./SalesItems.module.css";
import { getUserId} from "../../../utils/authUtils.js";
import ItemCard from "../../../components/ItemCard/ItemCard.jsx";

function SalesItemsPage() {
    const [myItems, setMyItems] = useState([]);

    useEffect(() => {
        const userId = getUserId();
        const allItems = JSON.parse(localStorage.getItem("items") || "");

        const filtered = allItems.filter(item => item.OwnerId === userId);
        setMyItems(filtered);
    }, []);

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.itemsBox}>
                    {myItems.length === 0 ? (
                        <div className={styles.empty}>등록한 상품이 없습니다.</div>
                    ) : (
                        myItems.map(item => (
                            <div className={styles.item} key={item.id}>
                                <ItemCard item={item} />
                                <div className={styles.btnRow}>
                                    <button> 수정 </button>
                                    <button> 삭제</button>
                                </div>
                            </div>
                        ))
                    )}
            </div>
            <Footer />
        </div>
    );
}

export default SalesItemsPage;
