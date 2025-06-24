import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./chatList.module.css";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

function ChatListPage() {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ 이미지 URL 처리 헬퍼 함수
  const getImageUrl = (item) => {
    console.log("getImageUrl 호출됨:", item);

    // 1. itemImages 배열이 있는 경우
    if (item.itemImages && item.itemImages.length > 0) {
      const imageData = item.itemImages[0];
      const imageUrl = imageData.photoPath || imageData.photo_path || imageData;
      console.log("itemImages 사용:", imageUrl);
      
      if (imageUrl && typeof imageUrl === 'string') {
        if (imageUrl.startsWith("/uploads/")) {
          const filename = imageUrl.replace("/uploads/", "");
          return `http://localhost:8080/api/image/${filename}`;
        }
        return `http://localhost:8080/api/image/${imageUrl}`;
      }
    }

    // 2. itemImageUrl이 있는 경우
    if (item.itemImageUrl) {
      console.log("itemImageUrl 사용:", item.itemImageUrl);
      if (item.itemImageUrl.startsWith("/uploads/")) {
        const filename = item.itemImageUrl.replace("/uploads/", "");
        return `http://localhost:8080/api/image/${filename}`;
      }
      return `http://localhost:8080/api/image/${item.itemImageUrl}`;
    }

    // 3. thumbnail이 있는 경우
    if (item.thumbnail) {
      console.log("thumbnail 사용:", item.thumbnail);
      if (item.thumbnail.startsWith("/uploads/")) {
        const filename = item.thumbnail.replace("/uploads/", "");
        return `http://localhost:8080/api/image/${filename}`;
      }
      return `http://localhost:8080/api/image/${item.thumbnail}`;
    }

    // 4. 기본 이미지
    console.log("기본 이미지 사용");
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuydtOuvuOyngDwvdGV4dD48L3N2Zz4=";
  };

  // ✅ 채팅방 목록 가져오기
  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId =
        localStorage.getItem("userId") ||
        localStorage.getItem("senderId") ||
        "guest";

      console.log("채팅방 목록 요청:", userId);

      if (!userId || userId === "guest" || userId === "null") {
        console.warn("유효하지 않은 사용자 ID:", userId);
        setChatRooms([]);
        return;
      }

      const response = await api.get("/chat/rooms", {
        params: { userId: userId },
        timeout: 15000,
      });

      console.log("채팅방 목록 응답:", response.data);

      if (!Array.isArray(response.data)) {
        console.warn("잘못된 응답 형식:", response.data);
        setChatRooms([]);
        return;
      }

      // ✅ 백엔드 데이터 변환
      console.log("백엔드 채팅방 데이터:", response.data);
      const transformedChatRooms = response.data
        .filter((room) => room && room.id)
        .map((room) => {
          console.log("채팅방 변환 중:", room);
          const imageUrl = getImageUrl(room);
          console.log("생성된 이미지 URL:", imageUrl);

          const transformedRoom = {
            id: room.id || room.roomId,
            roomId: room.roomId || room.id,
            nickname: room.otherUserName || room.nickname || "상대방",
            lastMessage: room.lastMessage || "메시지가 없습니다.",
            lastTimestamp:
              room.lastTimestamp || room.updatedAt || new Date().toISOString(),
            imageUrl: imageUrl,
            itemId: room.itemId,
            itemTitle: room.itemTitle || "상품명 없음",
            itemPrice: room.itemPrice || 0,
            unreadCount: room.unreadCount || 0,
            otherUserId: room.otherUserId || "unknown",
            status: room.status || "active",
          };
          console.log("변환된 채팅방:", transformedRoom);
          return transformedRoom;
        });

      const sortedRooms = transformedChatRooms.sort(
        (a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
      );

      setChatRooms(sortedRooms);
      localStorage.setItem("chatList", JSON.stringify(sortedRooms));
      console.log("채팅방 목록 설정 완료:", sortedRooms.length, "개");
    } catch (err) {
      console.error("채팅방 목록 조회 실패:", err);
      setError("채팅 목록을 불러오는데 실패했습니다.");
      
      try {
        const localData = JSON.parse(localStorage.getItem("chatList") || "[]");
        if (Array.isArray(localData) && localData.length > 0) {
          setChatRooms(localData);
          console.log("로컬 백업 데이터 사용:", localData.length, "개");
        } else {
          setChatRooms([]);
        }
      } catch (parseError) {
        console.error("로컬 데이터 파싱 실패:", parseError);
        setChatRooms([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ 채팅방 삭제
  const deleteChatRoom = async (roomId, event) => {
    event.stopPropagation();

    if (!window.confirm("채팅방을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const userId =
        localStorage.getItem("userId") || localStorage.getItem("senderId");

      const response = await api.delete(`/chat/rooms/${roomId}`, {
        params: { userId: userId },
      });

      if (response.data.success) {
        setChatRooms((prev) => prev.filter((room) => room.roomId !== roomId));
        alert("채팅방이 삭제되었습니다.");
      } else {
        alert(response.data.message || "채팅방 삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("채팅방 삭제 실패:", err);
      alert("채팅방 삭제에 실패했습니다.");
    }
  };

  // ✅ 읽지 않은 메시지 수 업데이트
  const markAsRead = async (roomId) => {
    try {
      const userId =
        localStorage.getItem("userId") || localStorage.getItem("senderId");

      await api.post(`/chat/rooms/${roomId}/read`, null, {
        params: { userId: userId },
      });

      setChatRooms((prev) =>
        prev.map((room) =>
          room.roomId === roomId ? { ...room, unreadCount: 0 } : room
        )
      );
    } catch (err) {
      console.error("읽음 처리 실패:", err);
    }
  };

  // ✅ 채팅방 클릭 핸들러 - 최종 수정 버전
  const handleChatRoomClick = (room) => {
    console.log("🚀 NEW 채팅방 클릭됨:", room);
    console.log("🚀 NEW roomId:", room.roomId);

    // 읽지 않은 메시지 읽음 처리
    if (room.unreadCount > 0) {
      markAsRead(room.roomId);
    }

    // ✅ 강제로 roomId 포함 경로로 이동
    const roomIdToUse = room.roomId || room.id;
    const targetPath = `/chat/${roomIdToUse}`;
    console.log("🚀 NEW 이동할 경로:", targetPath);
    console.log("🚀 NEW 사용된 roomId:", roomIdToUse);

    // ✅ 즉시 navigate 호출
    navigate(targetPath, {
      state: {
        ...room,
        roomId: roomIdToUse,
        itemId: room.itemId,
        otherUserId: room.otherUserId,
      },
    });

    console.log("🚀 NEW navigate 호출 완료:", targetPath);
    
    // ✅ 추가 확인
    setTimeout(() => {
      console.log("🚀 NEW 현재 URL:", window.location.pathname);
    }, 100);
  };

  useEffect(() => {
    fetchChatRooms();
    const interval = setInterval(fetchChatRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>로딩 중...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.chatList}>
        <div className={styles.chatListHeader}>
          <span className={styles.chatListTitle}>채팅 목록 (최신순)</span>
          {error && (
            <div className={styles.error}>
              오류: {error}
              <button onClick={fetchChatRooms} className={styles.retryButton}>
                새로고침
              </button>
            </div>
          )}
        </div>

        {chatRooms.length === 0 ? (
          <div className={styles.emptyMessage}>채팅 목록이 비어있습니다.</div>
        ) : (
          <>
            {chatRooms.map((room) => (
              <div
                key={room.roomId || room.id}
                className={styles.chatRoom}
                onClick={() => handleChatRoomClick(room)}>
                <img
                  src={room.imageUrl}
                  alt="상품 이미지"
                  className={styles.mainImage}
                  onError={(e) => {
                    console.error("이미지 로드 실패:", {
                      src: e.target.src,
                      roomId: room.roomId,
                      itemId: room.itemId,
                      originalImageUrl: room.imageUrl,
                      room: room
                    });
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuydtOuvuOyngDwvdGV4dD48L3N2Zz4=";
                    e.target.onerror = null;
                  }}
                />
                <div className={styles.chatBox}>
                  <div className={styles.chatRoomInfo}>
                    <span className={styles.userName}>{room.nickname}</span>
                    {room.itemTitle && (
                      <span className={styles.itemTitle}>
                        [{room.itemTitle}]
                      </span>
                    )}
                    {room.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>
                        {room.unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={styles.lastMessage}>{room.lastMessage}</span>
                  {room.itemPrice && (
                    <span className={styles.itemPrice}>
                      {room.itemPrice.toLocaleString()}원
                    </span>
                  )}
                </div>
                <div className={styles.chatRoomMeta}>
                  <span className={styles.time}>
                    {new Date(room.lastTimestamp).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => deleteChatRoom(room.roomId, e)}
                    title="채팅방 삭제">
                    나가기
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ChatListPage;
