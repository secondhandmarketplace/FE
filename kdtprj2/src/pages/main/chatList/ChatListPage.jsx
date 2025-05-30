import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./chatList.module.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

function ChatListPage() {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("chatList")) || [];
    setChatRooms(data);
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.chatList}>
        <span>채팅 목록</span>
        <>
          {chatRooms.map((room, idx) => (
            <div
              key={idx}
              className={styles.chatRoom}
              onClick={() => navigate("/chat", { state: room })}>
              <img
                src={room.imageUrl}
                alt="메인 이미지"
                className={styles.mainImage}
              />
              <div className={styles.chatBox}>
                <span className={styles.userName}>{room.nickname}</span>
                <span className={styles.lastMessage}>{room.lastMessage}</span>
              </div>
              <span className={styles.time}>
                {new Date(room.lastTimestamp).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </>
      </div>
      <Footer />
    </div>
  );
}
export default ChatListPage;
