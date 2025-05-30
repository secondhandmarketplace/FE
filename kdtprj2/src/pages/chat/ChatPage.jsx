import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./chat.module.css";
import Header from "../../components/Header/Header";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import { useLocation } from "react-router-dom";
import { getUserId } from "../../utils/authUtils.js";

const ChatPage = () => {
  const userId = getUserId();
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state;
  const [, setMyItems] = useState([]);

  const handleStatus = (itemId, newStatus) => {
    // 현재 로컬스토리지에서 모든 아이템 가져오기
    const allItems = JSON.parse(localStorage.getItem("items") || "[]");

    // 상태 변경
    const updatedItems = allItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    // 반영된 결과를 저장
    localStorage.setItem("items", JSON.stringify(updatedItems));

    // 상태도 다시 반영
    setMyItems(updatedItems.filter((item) => item.OwnerId === getUserId()));
    alert("거래 완료되었습니다.");
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.chatContainer}>
        <div className={styles.itemContainer}>
          <div className={styles.image}>
            <img src={item.imageUrl} width={90} height={90} alt="상품" />
            {item.OwnerId === userId && (
              <button onClick={() => handleStatus(item.id, "거래완료")}>
                거래하기
              </button>
            )}
          </div>
          <div className={styles.item}>
            <h2>{item.title}</h2>
            <p>가격: {item.price}원</p>
          </div>
        </div>
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
