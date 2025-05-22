import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./chatList.module.css";
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';

function ChatListPage() {
    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('chatList')) || [];
        setChatRooms(data);
    }, []);

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.chatList}>
                <ul>
                    {chatRooms.map((room, idx) => (
                        <li key={idx} className={styles.chatRoom} onClick={() => navigate("/chat", { state: room })}>
                                <p className={styles.lastMessage}>{room.lastMessage}</p>
                            <span className={styles.time}>
                                {new Date(room.lastTimestamp).toLocaleTimeString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </li>
                    ))}

                </ul>
            </div>
            <Footer />
        </div>
    )
}
export default ChatListPage;
