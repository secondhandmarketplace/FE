import React, { useState, useEffect, useRef } from "react";
import styles from "./home.module.css";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import ItemCard from "../../../components/ItemCard/ItemCard.jsx";
import { categories } from "../../../utils/categories.js";

const dummyData = [
  {
    id: 1,
    title: "놀아줄 asdf사람 구합니다.",
    price: 1000,
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
  {
    id: 3,
    title: "놀아줄 asdf사람 구합니다.",
    price: 10500,
    imageUrl: "/cat1.svg",
    tags: ["고양이", "시급알바"],
    status: "판매중",
    category: "기타",
  },
];

function HomePage() {
  const [items, setItems] = useState(dummyData);
  const [priceFilter, setPriceFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const results = items.filter((item) =>
    item.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 최고가/최저가 계산
  const getMaxPriceItem = (items) => {
    if (items.length === 0) return [];
    const maxPrice = Math.max(...items.map((item) => item.price));
    return items.filter((item) => item.price === maxPrice);
  };
  const getMinPriceItem = (items) => {
    if (items.length === 0) return [];
    const minPrice = Math.min(...items.map((item) => item.price));
    return items.filter((item) => item.price === minPrice);
  };

  // 필터링 로직
  let filteredItems = items.filter((item) => {
    const priceOk =
      priceFilter === "all"
        ? true
        : priceFilter === "free"
        ? item.price === 0
        : true; // max/min은 아래에서 따로 처리
    const categoryOk =
      categoryFilter === "all" ? true : item.category === categoryFilter;
    return priceOk && categoryOk;
  });

  if (priceFilter === "max") {
    filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);
  } else if (priceFilter === "min") {
    filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
  }

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
                  <div className={styles.emptyMessage}>
                    검색어를 입력해주세요.
                  </div>
                ) : results.length === 0 ? (
                  <div className={styles.emptyMessage}>
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  results.map((item) => <ItemCard key={item.id} item={item} hideCompleted={true} />)
                )}
              </div>
            </>
          ) : (
            <>
              <div className={styles.buttonContainer}>
                <button
                  className={`${styles.button} ${
                    priceFilter === "all" && categoryFilter === "all"
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => {
                    setPriceFilter("all");
                    setCategoryFilter("all");
                    homeContainerRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}>
                  전체 보기
                </button>
                <button
                  className={`${styles.button} ${
                    priceFilter === "free" ? styles.active : ""
                  }`}
                  onClick={() => {
                    setPriceFilter("free");
                    setCategoryFilter("all");
                    homeContainerRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}>
                  무료 나눔
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    className={`${styles.button} ${
                      categoryFilter === category ? styles.active : ""
                    }`}
                    onClick={() => {
                      setCategoryFilter(category);
                      setPriceFilter("all");
                      homeContainerRef.current?.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}>
                    {category}
                  </button>
                ))}
                <button
                  className={`${styles.button} ${
                    priceFilter === "max" ? styles.active : ""
                  }`}
                  onClick={() => {
                    setPriceFilter("max");
                    setCategoryFilter("all");
                    homeContainerRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}>
                  최고가
                </button>
                <button
                  className={`${styles.button} ${
                    priceFilter === "min" ? styles.active : ""
                  }`}
                  onClick={() => {
                    setPriceFilter("min");
                    setCategoryFilter("all");
                    homeContainerRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}>
                  최저가
                </button>
              </div>
              <div className={styles.content}>
                {filteredItems.length === 0 ? (
                  <div className={styles.emptyMessage}>
                    등록된 물품이 없습니다.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`${
                        item.status === "거래완료" ? styles.disabled : ""
                      }`}>
                      <ItemCard item={item} />
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
  );
}

export default HomePage;
