// src/pages/chat/ChatPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./chat.module.css";
import Header from "../../components/Header/Header";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import { getUserId } from "../../utils/authUtils.js";

// Axios 인스턴스
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const ChatPage = () => {
  const { chatRoomId } = useParams(); // URL에서 채팅방 ID 추출
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 변수명 통일: currentUserid (소문자 d)로 선언되어 있으므로, 이후에도 동일하게 사용
  const currentUserid = getUserId();

  const [item, setItem] = useState(location.state?.item || null);
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatRoomId) {
      navigate("/chatList");
      return;
    }

    const fetchChatData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/chat/rooms/${chatRoomId}`, {
          params: { userId: currentUserid },
        });
        const roomData = response.data;
        console.log("채팅방 데이터:", roomData);
        setChatRoom(roomData);

        // ✅ 백엔드에서 item 정보를 개별 필드로 제공하므로 이를 조합
        if (roomData.itemId && roomData.itemTitle) {
          const itemData = {
            id: roomData.itemId,
            itemid: roomData.itemId, // 백엔드 호환성
            title: roomData.itemTitle,
            price: roomData.itemPrice,
            imageUrl: roomData.itemImageUrl,
            sellerId: roomData.otherUserId, // 상대방이 판매자라고 가정
            status: "판매중" // 기본값
          };
          console.log("조합된 아이템 데이터:", itemData);
          setItem(itemData);
        } else if (roomData.itemTransactionId) {
          // ✅ 개별 필드가 없으면 별도 API 호출
          console.log("아이템 정보 별도 조회:", roomData.itemTransactionId);
          const itemResponse = await api.get(`/items/${roomData.itemTransactionId}`);
          setItem(itemResponse.data);
        }
      } catch (error) {
        console.error("채팅방 정보를 불러오는 데 실패했습니다:", error);
        alert("존재하지 않거나 접근 권한이 없는 채팅방입니다.");
        navigate("/chatList");
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [chatRoomId, currentUserid]);

  // 거래 상태를 '거래완료'로 변경하는 함수
  const handleStatus = async (itemId, newStatus) => {
    try {
      await api.put(`/items/${itemId}/status`, {
        status: newStatus,
        Userid: currentUserid,
      });
      alert("거래 완료로 상태가 변경되었습니다.");
      // 상태 변경 후 UI에 즉시 반영
      setItem((prevItem) => ({ ...prevItem, status: newStatus }));
    } catch (error) {
      console.error("거래 상태 변경 실패:", error);
      alert("거래 상태 변경에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>채팅방을 불러오는 중...</div>
      </div>
    );
  }

  if (!item || !chatRoom) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>채팅 정보를 표시할 수 없습니다.</div>
      </div>
    );
  }

  // 판매자 ID는 chatRoom 또는 item 정보에서 가져와 안정성을 높임
  const sellerId = chatRoom.sellerId || item.sellerId;

  const getImageUrl = (url) => {
    if (!url) return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuydtOuvuOyngDwvdGV4dD48L3N2Zz4=";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/uploads/")) {
      const filename = url.replace("/uploads/", "");
      return `http://localhost:8080/api/image/${filename}`;
    }
    return `http://localhost:8080/api/image/${url}`;
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.chatContainer}>
        <div className={styles.itemContainer}>
          <div className={styles.image}>
            <img
              src={
                (chatRoom?.itemImageUrl || item?.imageUrl)?.startsWith("http")
                  ? chatRoom?.itemImageUrl || item?.imageUrl
                  : `http://localhost:8080${
                      chatRoom?.itemImageUrl || item?.imageUrl
                    }`
              }
              alt={item?.title || "상품"}
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuydtOuvuOyngDwvdGV4dD48L3N2Zz4=";
                e.currentTarget.onerror = null; // ✅ 무한 로드 방지
              }}
            />
          </div>
          <div className={styles.item}>
            <h2>{item.title}</h2>
            <p>가격: {item.price?.toLocaleString()}원</p>
            <p>상태: {item.status || "판매중"}</p>
          </div>
          {/* 현재 사용자가 판매자이고, 아직 거래완료가 아닐 때만 버튼 표시 */}
          {sellerId === currentUserid && item.status !== "거래완료" && (
            <button
              onClick={() => handleStatus(item.id, "거래완료")}
              className={styles.tradeButton}>
              거래완료
            </button>
          )}
        </div>

        {/* ChatWindow 컴포넌트에 필요한 ID들을 props로 전달 */}
        <ChatWindow roomId={chatRoomId} userId={currentUserid} />
      </div>
    </div>
  );
};

export default ChatPage;
