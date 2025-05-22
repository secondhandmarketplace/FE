import { io } from 'socket.io-client';

const socket = io('http://localhost:5174');

export const makeRoomIdFromItem = (item) => {
    // 상품 ID 기반으로 고유한 roomId 생성
    return `room-${item.id}`;
};

export const handleSend = ({ input, setInput, roomId }) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const timestamp = Date.now();
    const newMsg = {
        sender: socket.id,
        content: trimmed,
        timestamp,
        roomId,
    };

    socket.emit('messages', newMsg);
    setInput('');

    const storedMessages = JSON.parse(localStorage.getItem(`chatMessages-${roomId}`)) || [];
    const updatedMessages = [...storedMessages, newMsg];
    localStorage.setItem(`chatMessages-${roomId}`, JSON.stringify(updatedMessages));

    const chatList = JSON.parse(localStorage.getItem('chatList')) || [];

    const newRoom = {
        roomId,
        lastMessage: newMsg.content,
        lastTimestamp: newMsg.timestamp,
    };

    const updated = [
        ...chatList.filter(r => r.roomId !== newRoom.roomId),
        newRoom,
    ];

    localStorage.setItem('chatList', JSON.stringify(updated));
};
