import socket from './socket.js'

export const makeRoomIdFromItem = (item) => {
    // 상품 ID 기반으로 고유한 roomId 생성
    return `room-${item.id}`;
};

const user = JSON.parse(localStorage.getItem('user'));
const userId = user?.userId;

export const handleSend = ({ input, setInput, roomId, item }) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    console.log("handleSend");

    const timestamp = Date.now();
    const newMsg = {
        sender: userId,
        content: trimmed,
        timestamp,
        roomId,
    };

    socket.emit('messages', newMsg);
    setInput('');

    const chatList = JSON.parse(localStorage.getItem('chatList')) || [];

    const newRoom = {
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
