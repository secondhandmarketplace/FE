import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './chatWindow.module.css';
import io from 'socket.io-client';
import Message from '../Message/Message';
import sendBtn from '/sendBtn.svg';
import { handleSend, makeRoomIdFromItem } from '../../utils/chatUtils';

// 클라이언트
const socket = io("http://localhost:5174");
socket.on('connect', () => {
    console.log('연결돾ㅆ냐:', socket.id);
});

function ChatWindow() {
    const location = useLocation();
    const item = location.state;

    const [message, setMessage] = useState([]);
    const [input, setInput] = useState('');
    const messageEndRef = useRef(null);

    const roomId = makeRoomIdFromItem(item);

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
        });
    };

    const firstDate = message.length > 0
        ? formatDate(message[0].timestamp)
        : null;

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    useEffect(() => {
        socket.emit('joinRoom', roomId);
    }, [roomId]);

    useEffect(() => {
        // 마운트 시 로컬 메시지 불러오기
        const stored = JSON.parse(localStorage.getItem(`chatMessages-${roomId}`)) || [];
        setMessage(stored);
    }, [roomId]);

    useEffect(() => {
        const handleReceive = (msg) => {
            if (msg.roomId !== roomId) return;

            setMessage(prev => {
                const updated = [...prev, msg];
                localStorage.setItem(`chatMessages-${roomId}`, JSON.stringify(updated));
                return updated;
            });
        };

        socket.off('messages');
        socket.on('messages', handleReceive);

        return () => {
            socket.off('messages', handleReceive);
        };
    }, [roomId]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    return (
        <div className={styles.chatWindow}>
            <div className={styles.chatMessage}>
                <div className={styles.dateDivider}>
                    {firstDate}
                </div>
                {message.map((msg, idx) => (
                    <Message
                        key={idx}
                        text={msg.content}
                        isMine={msg.sender === socket.id}
                        time={formatTime(msg.timestamp)}
                    />
                ))}
                <div ref={messageEndRef} />
            </div>
            <div className={styles.chatInput}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) handleSend({input, setInput, roomId});
                    }}
                    placeholder="메세지를 입력하세요"
                />
                <img src={sendBtn} alt="전송 버튼" onClick={() => handleSend({input, setInput, roomId })} />
            </div>
        </div>
    )
}

export default ChatWindow;