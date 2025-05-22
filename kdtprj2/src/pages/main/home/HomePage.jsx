import React, {useState, useEffect, useRef} from "react";
import styles from "./home.module.css";
import Header from '../../../components/Header/Header.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import ItemCard from '../../../components/ItemCard/ItemCard.jsx';

const dummyData = [
    {
        id: 1,
        title: "놀아줄 사람 구합니다.",
        price: "시급 1만원",
        imageUrl: "/cat1.svg",
        tags: ["고양이", "시급알바"],
        status: "판매중",
    },
    {
        id: 2,
        title: "놀아줄 사람 구합니다.",
        price: "시급 1만원",
        imageUrl: "/cat1.svg",
        tags: ["고양이", "시급알바"],
        status: "거래완료",
    },
];

function HomePage() {
    const [items, setItems] = useState(dummyData);
    const [filter, setFilter] = useState("all");
    const filteredItems = filter === "free"
        ? items.filter(item => item.price === 0)
        : items;
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
                        <button className={styles.all} onClick={() => {
                            setFilter("all");
                            homeContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                        }}>
                            전체 보기
                        </button>
                        <button className={styles.free} onClick={() => {
                            setFilter("free");
                            homeContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                        }}>
                            무료 나눔
                        </button>
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