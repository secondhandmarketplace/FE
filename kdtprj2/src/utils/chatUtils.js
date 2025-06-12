import { getUserId } from "./authUtils.js";

export const makeRoomIdFromItem = (item) => {
  return `room-${item.id}`;
};

export const handleSend = ({ input, setInput, roomId, item }) => {
  const userId = getUserId();

  if (!userId) {
    console.error("사용자 ID가 없어 메시지를 전송할 수 없습니다.");
    alert("로그인이 필요합니다.");
    return;
  }

  const trimmed = input.trim();
  if (!trimmed) return;

  console.log("메시지 전송 시작:", { userId, roomId, content: trimmed });

  const newMsg = {
    sender: userId,
    content: trimmed,
    timestamp: Date.now(),
    roomId,
  };

  // WebSocket 전송 예시 (실제 구현에서는 socket 객체 필요)
  // socket.emit("messages", newMsg);

  setInput("");

  try {
    const chatList = JSON.parse(localStorage.getItem("chatList")) || [];
    const newRoom = {
      ...item,
      roomId,
      lastMessage: newMsg.content,
      lastTimestamp: newMsg.timestamp,
      imageUrl: item.imageUrl,
      nickname: "판매자",
    };
    const updated = [
      newRoom,
      ...chatList.filter((r) => r.roomId !== newRoom.roomId),
    ];
    localStorage.setItem("chatList", JSON.stringify(updated));
    console.log("채팅 목록 업데이트 완료 (최신순)");
  } catch (error) {
    console.error("채팅 목록 업데이트 실패:", error);
  }
};
