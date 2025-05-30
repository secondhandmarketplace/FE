import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import styles from "./itemDetail.module.css";
import { makeRoomIdFromItem } from "../../../utils/chatUtils.js";
import ItemCard from "../../../components/ItemCard/ItemCard.jsx";
import { useState } from "react";

function ItemDetailPage() {
  const location = useLocation();
  const item = location.state;
  const navigate = useNavigate();

  // 이미지 슬라이더용 (이미지가 여러 장이면 배열로)
  const images = item.images || [item.imageUrl];
  const [current, setCurrent] = useState(0);

  const allItems = JSON.parse(localStorage.getItem("items") || "[]");
  const relatedItems = allItems.filter(
    (i) =>
      i.id !== item.id &&
      i.category === item.category &&
      i.status !== "거래완료"
  );

  const handleChatClick = () => {
    const roomId = makeRoomIdFromItem(item);
    navigate("/chat", { state: { ...item, roomId } });
  };

  const handleLikeClick = () => {
    const likedItems = JSON.parse(localStorage.getItem("likedItems") || "[]");
    const exists = likedItems.some((i) => i.id === item.id);
    if (exists) {
      alert("이미 찜한 상품입니다.");
      return;
    }
    likedItems.push(item);
    localStorage.setItem("likedItems", JSON.stringify(likedItems));
    alert("찜 목록에 추가되었습니다.");
  };

  // 슬라이더 핸들러
  const prevImg = () =>
    setCurrent((current - 1 + images.length) % images.length);
  const nextImg = () => setCurrent((current + 1) % images.length);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.detailContainer}>
        {/* 이미지 슬라이더 */}
        <div className={styles["image-slider"]}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`상품이미지${idx + 1}`}
              className={`${styles["slider-image"]} ${
                current === idx ? styles["fade-in"] : styles["fade-out"]
              }`}
              style={{ left: 0, right: 0 }}
            />
          ))}
          {images.length > 1 && (
            <>
              <button
                className={`${styles["slider-button"]} ${styles.left}`}
                onClick={prevImg}>
                &lt;
              </button>
              <button
                className={`${styles["slider-button"]} ${styles.right}`}
                onClick={nextImg}>
                &gt;
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className={styles["indicator-dots"]}>
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`${styles.dot} ${
                  current === idx ? styles.active : ""
                }`}
                onClick={() => setCurrent(idx)}
              />
            ))}
          </div>
        )}

        {/* 카테고리 태그 */}
        <div className={styles["category-tag"]}>{item.category}</div>

        {/* 판매자 정보 */}
        <div className={styles["seller-info"]}>
          <span>판매자:</span>
          <span className={styles["seller-name"]}>학생1</span>
        </div>

        {/* 제목/가격/설명 */}
        <div className={styles["item-title"]}>{item.title}</div>
        <div className={styles.price}>{item.price.toLocaleString()}원</div>
        <div className={styles["description-text"]}>{item.description}</div>
        <div className={styles["info-row"]}>
          <span>거래 장소: {item.place || "미정"}</span>
          <span>태그: {item.tags.join(", ")}</span>
        </div>

        <button className={styles["chat-button"]} onClick={handleChatClick}>
          채팅하기
        </button>
        <button className={styles["like-button"]} onClick={handleLikeClick}>
          찜하기
        </button>

        {/* 연관 상품 */}
        <div className={styles.relatedItem}>
          <div className={styles["related-title"]}>연관된 상품</div>
          {relatedItems.length > 0 ? (
            relatedItems.map((related) => (
              <ItemCard key={related.id} item={related} />
            ))
          ) : (
            <div className={styles.noRelated}>관련 상품이 없습니다.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ItemDetailPage;
