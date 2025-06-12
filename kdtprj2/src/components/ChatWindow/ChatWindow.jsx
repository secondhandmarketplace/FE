import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { Stomp } from "@stomp/stompjs";
import axios from "axios";
import Message from "../Message/Message";
import "./chatWindow.css";

// ✅ axios 인스턴스 생성 (Java Spring 환경)
const api = axios.create({
  baseURL: "http://localhost:8080/api", // baseURL에 /api 포함
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const ChatWindow = ({ roomId, otherUserId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // ✅ 사용자 ID 가져오기 (로컬 스토리지 활용)
  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("senderId") ||
    "guest";

  // ✅ 기존 메시지 로드 (axios 연동, 최근 등록순 정렬)
  const loadMessages = async () => {
    if (!roomId) return;

    try {
      console.log("메시지 로드:", roomId);
      // ✅ 백엔드와 경로 일치: /api/chat-messages/room/{roomId}
      const response = await api.get(`/chat-messages/room/${roomId}`);
      console.log("메시지 로드 완료:", response.data);

      // ✅ 시간순으로 정렬 (오래된 순)
      const sortedMessages = Array.isArray(response.data)
        ? response.data.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
        : [];
      setMessages(sortedMessages);
    } catch (error) {
      console.error("메시지 로드 실패:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ WebSocket 연결 (실시간 메시징 지원)
  useEffect(() => {
    if (!roomId) return;

    try {
      console.log("WebSocket 연결 시작:", roomId);

      // ✅ SockJS 연결 시도 (서버에서 SockJS 활성화 필요)
      const socket = new SockJS("http://localhost:8080/ws");
      const client = Stomp.over(socket);
      client.debug = () => {}; // 디버그 메시지 비활성화

      client.connect(
        {},
        (frame) => {
          console.log("WebSocket 연결 성공:", frame);
          setConnected(true);
          setStompClient(client);

          // ✅ 채팅방 구독 (STOMP 주소로 채팅방 구분)
          client.subscribe(`/topic/chat/${roomId}`, (message) => {
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log("실시간 메시지 수신:", receivedMessage);
              setMessages((prev) => [...prev, receivedMessage]);
            } catch (error) {
              console.error("메시지 파싱 오류:", error);
            }
          });

          // ✅ 기존 메시지 로드
          loadMessages();
        },
        (error) => {
          console.error("WebSocket 연결 실패:", error);
          setConnected(false);
          // ✅ WebSocket 실패 시에도 메시지 로드
          loadMessages();
        }
      );

      return () => {
        if (client && client.connected) {
          client.disconnect(() => {
            console.log("WebSocket 연결 해제");
          });
        }
      };
    } catch (error) {
      console.error("WebSocket 초기화 실패:", error);
      loadMessages();
    }
  }, [roomId]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      senderId: userId,
      content: inputMessage.trim(),
      chatRoomId: roomId,
      timestamp: new Date().toISOString(),
    };

    try {
      console.log("메시지 전송:", messageData);

      // ✅ 1순위: WebSocket으로 실시간 전송
      if (stompClient && stompClient.connected) {
        // stompClient.connected 추가
        stompClient.send(`/app/chat.send`, {}, JSON.stringify(messageData));
        console.log("WebSocket으로 메시지 전송 완료");
      } else {
        // ✅ 2순위: axios로 HTTP 전송 (백업)
        const response = await api.post(
          `/chat-messages/room/${roomId}`,
          messageData
        );
        console.log("HTTP로 메시지 전송 완료:", response.data);
        setMessages((prev) => [...prev, response.data]);
      }

      setInputMessage("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="chat-window loading">
        <div>메시지를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* <div className="chat-header">
        <span>💬 실시간 채팅 ({connected ? "🟢 연결됨" : "🔴 오프라인"})</span>
        <span className="room-info">Room: {roomId}</span>
      </div> */}

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-message">
            메시지가 없습니다. 첫 메시지를 보내보세요! 🚀
          </div>
        ) : (
          messages.map((message, index) => (
            <Message
              key={message.messageId || index}
              text={message.content}
              isMine={message.senderId === userId}
              time={new Date(message.sentAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요... (실시간 전송)"
          rows={2}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim()}
          className={connected ? "connected" : "offline"}>
          {connected ? "💌 전송" : "📤 전송"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
