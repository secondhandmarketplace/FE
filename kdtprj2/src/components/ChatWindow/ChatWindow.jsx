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

const ChatWindow = ({ roomId, userId: propUserId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // ✅ 사용자 ID 가져오기 (props 우선, 로컬 스토리지 백업)
  const userId = propUserId ||
    localStorage.getItem("userid") ||
    localStorage.getItem("userId") ||
    localStorage.getItem("senderId") ||
    "guest";

  console.log("ChatWindow userId:", userId, "roomId:", roomId);

  // ✅ 기존 메시지 로드 (axios 연동, 최근 등록순 정렬)
  const loadMessages = async () => {
    console.log("loadMessages 호출됨 - roomId:", roomId, "userId:", userId);

    if (!roomId) {
      console.log("roomId가 없어서 메시지 로드 중단");
      setLoading(false);
      return;
    }

    try {
      console.log("메시지 로드 시작:", roomId);
      // ✅ 백엔드와 경로 일치: /api/chat/rooms/{roomId}/messages
      const response = await api.get(`/chat/rooms/${roomId}/messages`);
      console.log("메시지 로드 완료:", response.data);

      // ✅ 시간순으로 정렬 (오래된 순)
      const sortedMessages = Array.isArray(response.data)
        ? response.data.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
        : [];
      setMessages(sortedMessages);
      console.log("정렬된 메시지 설정 완료:", sortedMessages.length, "개");
    } catch (error) {
      console.error("메시지 로드 실패:", error);
      console.error("에러 상세:", error.response?.data);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ WebSocket 연결 (실시간 메시징 지원)
  useEffect(() => {
    console.log("useEffect 실행됨 - roomId:", roomId, "userId:", userId);

    if (!roomId) {
      console.log("roomId가 없어서 WebSocket 연결 중단");
      return;
    }

    if (!userId || userId === "guest") {
      console.log("유효하지 않은 userId:", userId, "- WebSocket 연결 중단");
      return;
    }

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

              // 중복 메시지 방지: 이미 존재하는 메시지인지 확인
              setMessages((prev) => {
                const exists = prev.some(msg =>
                  msg.messageId === receivedMessage.messageId ||
                  (msg.content === receivedMessage.content &&
                   msg.senderId === receivedMessage.senderId &&
                   Math.abs(new Date(msg.sentAt) - new Date(receivedMessage.sentAt)) < 1000)
                );

                if (exists) {
                  console.log("중복 메시지 무시:", receivedMessage);
                  return prev;
                }

                return [...prev, receivedMessage];
              });
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
  }, [roomId, userId]);

  // ✅ 메시지 변경 시 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ 메시지 변경 시 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      senderId: userId,
      content: inputMessage.trim(),
      chatRoomId: roomId,
      timestamp: new Date().toISOString(),
    };

    try {
      console.log("메시지 전송 시도:", messageData);

      // ✅ 1순위: WebSocket으로 실시간 전송
      if (stompClient && stompClient.connected) {
        stompClient.send(`/app/chat.send`, {}, JSON.stringify(messageData));
        console.log("WebSocket으로 메시지 전송 완료");
        setInputMessage(""); // WebSocket 전송 후 입력창 비우기
      } else {
        // ✅ 2순위: axios로 HTTP 전송 (백업)
        console.log("WebSocket 연결 없음, HTTP로 전송");

        const response = await api.post(
          `/chat/rooms/${roomId}/messages`,
          messageData
        );
        console.log("HTTP로 메시지 전송 완료:", response.data);

        // HTTP 전송 성공 시에만 메시지 추가 및 입력창 비우기
        if (response.data) {
          setMessages((prev) => [...prev, response.data]);
          setInputMessage("");
        }
      }

    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert(`메시지 전송에 실패했습니다: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  console.log("ChatWindow 렌더링 - loading:", loading, "roomId:", roomId, "userId:", userId);

  if (!roomId) {
    return (
      <div className="chat-window error">
        <div>❌ 채팅방 ID가 없습니다.</div>
      </div>
    );
  }

  if (!userId || userId === "guest") {
    return (
      <div className="chat-window error">
        <div>❌ 사용자 정보가 없습니다. 로그인이 필요합니다.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-window loading">
        <div>메시지를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* 디버그 정보 */}
      <div style={{ padding: "10px", background: "#f0f0f0", fontSize: "12px", borderBottom: "1px solid #ddd" }}>
        🔍 DEBUG: roomId={roomId}, userId={userId}, messages={messages.length}개, connected={connected ? "YES" : "NO"}
      </div>

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
