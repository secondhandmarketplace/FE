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
        price: 10000,
        imageUrl: "/cat1.svg",
        tags: ["고양이", "시급알바"],
        status: "판매중",
        category: "기타",
    },
    {
        id: 2,
        title: "놀아줄 사람 구합니다.",
        price: 10000,
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
    const [isSearching, setIsSearching] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");


    const results = items.filter(item =>
        item.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );

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
                <Header onSearchClick={() => {
                    setIsSearching(true);
                    setSearchKeyword("");
                    setPriceFilter("all");
                    setCategoryFilter("all");
                }}
                isSearching={isSearching}
                onExitSearch={() => setIsSearching(false)}
                />
                <div className={styles.homeContainer} ref={homeContainerRef}>
                    {isSearching ? (
                        <>
                            <div className={styles.result}>
                                <input
                                    className={styles.input}
                                    placeholder="검색어를 입력하세요"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                                {searchKeyword.trim() === "" ? (
                                    <div className={styles.emptyMessage}>검색어를 입력해주세요.</div>
                                ) : results.length === 0 ? (
                                    <div className={styles.emptyMessage}>검색 결과가 없습니다.</div>
                                ) : (
                                    results.map(item => <ItemCard key={item.id} item={item} />)
                                )}
                            </div>
                        </>
                    ):(
                        <>
                            <div className={styles.buttonContainer}>
                                <button className={styles.button} onClick={() => {
                                    setPriceFilter("all");
                                    setCategoryFilter("all");
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
                            <div className={styles.content}>
                                {filteredItems.length === 0 ? (
                                    <div className={styles.emptyMessage}>
                                        등록된 물품이 없습니다.
                                    </div>
                                ) : (
                                    filteredItems.map((item) => (
                                        <div className={`${item.status === "거래완료" ? styles.disabled : ""}`}>
                                            <ItemCard key={item.id} item={item} />
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
                <Footer />
            </div>
        </>
    )
}

export default HomePage;