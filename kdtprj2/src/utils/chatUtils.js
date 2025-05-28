import socket from './socket.js'
import {getUserId} from "./authUtils.js";

export const makeRoomIdFromItem = (item) => {
    // 상품 ID 기반으로 고유한 roomId 생성
    return `room-${item.id}`;
};

const userId = getUserId();

export const handleSend = ({ input, setInput, roomId, item }) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    console.log("handleSend");

    const newMsg = {
        sender: userId,
        content: trimmed,
        timestamp: Date.now(),
        roomId,
    };

    socket.emit('messages', newMsg);
    setInput('');

    const chatList = JSON.parse(localStorage.getItem('chatList')) || [];

    const newRoom = {
        ...item,
        roomId,
        lastMessage: newMsg.content,
        lastTimestamp: newMsg.timestamp,
        imageUrl: item.imageUrl,
        nickname: "판매자",
    };

    const updated = [
        ...chatList.filter(r => r.roomId !== newRoom.roomId),
        newRoom,
    ];

    localStorage.setItem('chatList', JSON.stringify(updated));
};
