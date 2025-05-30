import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ItemCard.module.css";
import Tag from "../Tag/Tag";

function ItemCard({ item }) {
  const navigate = useNavigate();

  // 거래완료 상품은 렌더링하지 않음
  if (item.status === "거래완료") return null;

  const handleClick = () => {
    const viewed = JSON.parse(localStorage.getItem("viewedItems") || "[]");

    // 중복 방지: 이미 있는 item 은 제거하고 맨 뒤에 다시 추가 (최근 조회 기준)
    const filtered = viewed.filter((v) => v.id !== item.id);
    const updated = [...filtered, item]; // 최신 클릭을 맨 뒤로

    localStorage.setItem("viewedItems", JSON.stringify(updated));

    const exists = viewed.find((v) => v.id === item.id);
    if (!exists) {
      viewed.push(item);
      localStorage.setItem("viewedItems", JSON.stringify(viewed));
    }

    navigate(`/item/${item.id}`, { state: item });
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageWrapper}>
        <img src={item.imageUrl} alt="상품" />
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.price}>{item.price}</p>
        <div className={styles.tags}>
          {(item.tags || []).map((tag, idx) => (
            <Tag key={idx} text={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
