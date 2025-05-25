import React, {useState, useEffect, useRef} from "react";
import styles from "./home.module.css";
import Header from '../../../components/Header/Header.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import ItemCard from '../../../components/ItemCard/ItemCard.jsx';
import { categories } from "../../../utils/categories.js";

const dummyData = [
    {
        id: 1,
        title: "놀아줄 사람 구합니다.",
        price: "시급 1만원",
        imageUrl: "/cat1.svg",
        tags: ["고양이", "시급알바"],
        status: "판매중",
        category: "기타",
    },
    {
        id: 2,
        title: "놀아줄 사람 구합니다.",
        price: "시급 1만원",
        imageUrl: "/cat1.svg",
        tags: ["고양이", "시급알바"],
        status: "거래완료",
        category: "기타",
    },
];

function HomePage() {
    const [items, setItems] = useState(dummyData);
    const [priceFilter, setPriceFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const filteredItems = items.filter(item => {
        const priceOk = priceFilter === "all" ? true : item.price === 0;
        const categoryOk = categoryFilter === "all" ? true : item.category === categoryFilter;
        return priceOk && categoryOk;
    });

    const homeContainerRef = useRef(null);

    useEffect(() => {
        const savedItems = JSON.parse(localStorage.getItem("items") || "[]");
        setItems([...dummyData, ...savedItems]);

    }, []);

    return (
        <>
            <div className={styles.container}>
                <Header />
                <div className={styles.homeContainer} ref={homeContainerRef}>
                    <div className={styles.buttonContainer}>
                        <button className={styles.button} onClick={() => {
                            setPriceFilter("all");
                            homeContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                        }}>
                            전체 보기
                        </button>
                        <button className={styles.button} onClick={() => {
                            setPriceFilter("free");
                            homeContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                        }}>
                            무료 나눔
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`${styles.button} ${categoryFilter === category ? styles.active : ""}`}
                                onClick={() => {
                                    setCategoryFilter(category);
                                    homeContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    {filteredItems.length === 0 ? (
                        <div className={styles.emptyMessage}>
                            등록된 물품이 없습니다.
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <ItemCard key={item.id} item={item} />
                        ))
                    )}
                </div>
                <Footer />
            </div>
        </>
    )
}

export default HomePage;