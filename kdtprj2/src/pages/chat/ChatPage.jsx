import React from "react";
import styles from "./chat.module.css";
import Header from '../../components/Header/Header';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import { useLocation } from "react-router-dom";

const ChatPage = () => {
    const location = useLocation();
    const item = location.state;

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.chatContainer}>
                <div className={styles.itemContainer}>
                    <div className={styles.image}>
                        <img src={item.imageUrl} width={90} height={90} alt="상품" />
                    </div>
                    <div className={styles.item}>
                        <h2>{item.title}</h2>
                        <p>가격: {item.price}원</p>
                    </div>
                </div>
                <ChatWindow />
            </div>
        </div>
    )
}

export default ChatPage;