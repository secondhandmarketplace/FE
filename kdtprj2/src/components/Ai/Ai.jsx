import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Ai.css";
import Header from "../Header/Header";

// 사용자 ID를 localStorage나 context 등에서 가져온다고 가정
function getCurrentUserId() {
  return localStorage.getItem("senderId") || "guest";
}

// 답변을 예쁘게(줄바꿈, 볼드) 변환
function renderAiAnswer(answer) {
  if (!answer) return null;
  // **bold** 처리, 줄바꿈 처리
  let html = answer
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const Ai = () => {
  const userId = getCurrentUserId();
  const STORAGE_KEY = `ai-chat-messages-${userId}`;

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // 1. 컴포넌트 마운트 시 사용자별 localStorage에서 메시지 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
    // eslint-disable-next-line
  }, [STORAGE_KEY]);

  // 2. 메시지 변경될 때마다 사용자별 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, STORAGE_KEY]);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setError(null);

    const newMessages = [...messages, { role: "user", content: prompt }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch(
        `/ai/ask?question=${encodeURIComponent(prompt)}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`서버 오류 (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const updatedMessages = [
        ...newMessages,
        {
          role: "ai",
          content: data.answer || "답변이 없습니다.",
          mainItem: data.mainItem || null,
          recommendedItems: data.recommendedItems || [],
        },
      ];
      setMessages(updatedMessages);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "ai", content: "⚠️ " + (err.message || "에러 발생") },
      ]);
      setError(err.message);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  // 대화 기록 초기화
  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="Ai-Container">
      <Header />
      <div className="Ai-ChatArea">
        <div className="Ai-ChatList">
          {messages.length === 0 && (
            <div className="Ai-Empty">AI에게 무엇이든 물어보세요!</div>
          )}
          {messages.map((msg, idx) =>
            msg.role === "user" ? (
              <div className="Ai-ChatRow Ai-UserRow" key={idx}>
                <div className="Ai-UserBubble">{msg.content}</div>
              </div>
            ) : (
              <div className="Ai-ChatRow Ai-AiRow" key={idx}>
                <div className="Ai-AiBubble">{renderAiAnswer(msg.content)}</div>
                {/* 메인 아이템 (크게 표시) */}
                {msg.mainItem && (
                  <div className="Ai-MainItem">
                    <div className="Ai-MainItemLabel">찾으신 상품</div>
                    <Link
                      to={`/post/${msg.mainItem.id}`}
                      className="Ai-MainItemCard">
                      <img
                        src={
                          msg.mainItem.image?.startsWith("http")
                            ? msg.mainItem.image
                            : `http://localhost:8080${msg.mainItem.image}`
                        }
                        alt={msg.mainItem.title}
                        className="Ai-MainItemImage"
                        onError={(e) => {
                          e.target.src = "/assets/default-image.png";
                        }}
                      />
                      <div className="Ai-MainItemInfo">
                        <h3 className="Ai-MainItemTitle">
                          {msg.mainItem.title}
                        </h3>
                        <p className="Ai-MainItemPrice">
                          {msg.mainItem.price?.toLocaleString()}원
                        </p>
                        <p className="Ai-MainItemLocation">
                          📍 {msg.mainItem.location}
                        </p>
                      </div>
                    </Link>
                  </div>
                )}
                {/* 추천 아이템들 (작게 표시) */}
                {msg.recommendedItems && msg.recommendedItems.length > 0 && (
                  <div className="Ai-RecommendedItems">
                    <div className="Ai-RecommendedLabel">Ai 추천 상품</div>
                    <div className="Ai-RecommendedList">
                      {msg.recommendedItems.map((item, itemIdx) => (
                        <Link
                          to={`/post/${item.id}`}
                          key={itemIdx}
                          className="Ai-RecommendedCard">
                          <img
                            src={
                              item.image?.startsWith("http")
                                ? item.image
                                : `http://localhost:8080${item.image}`
                            }
                            alt={item.title}
                            className="Ai-RecommendedImage"
                            onError={(e) => {
                              e.target.src = "/assets/default-image.png";
                            }}
                          />
                          <div className="Ai-RecommendedInfo">
                            <h4 className="Ai-RecommendedTitle">
                              {item.title}
                            </h4>
                            <p className="Ai-RecommendedPrice">
                              {item.price?.toLocaleString()}원
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
          <div ref={chatEndRef} />
        </div>
        {error && <div className="Ai-Error">에러: {error}</div>}
      </div>
      <form className="Ai-PromptForm" onSubmit={handlePromptSubmit}>
        <input
          type="text"
          className="Ai-PromptInput"
          placeholder="메시지를 입력하세요"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="Ai-PromptBtn"
          disabled={loading || !prompt.trim()}>
          {loading ? "..." : "전송"}
        </button>
      </form>
      {/* <button className="Ai-ClearBtn" onClick={handleClearHistory}>
        대화 기록 초기화
      </button> */}
    </div>
  );
};

export default Ai;
