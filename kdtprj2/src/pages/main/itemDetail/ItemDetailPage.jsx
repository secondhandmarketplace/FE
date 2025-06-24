// src/pages/main/itemDetail/ItemDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import styles from "./itemDetail.module.css";
import ItemCard from "../../../components/ItemCard/ItemCard.jsx";
import { getUserId } from "../../../utils/authUtils.js";

// Axios 인스턴스: API 요청을 위한 기본 설정
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

function ItemDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: itemId } = useParams();

  const [item, setItem] = useState(location.state?.item || null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);

  // ✅ 현재 로그인 사용자 ID
  const currentUserId = getUserId();

  useEffect(() => {
    if (itemId) {
      const fetchItemAndRelatedData = async () => {
        try {
          setLoading(true);
          setError(null);

          // ✅ 상품 상세 정보 조회
          const itemResponse = await api.get(`/items/${itemId}`);
          const data = itemResponse.data;

          // ✅ 이미지 경로: 서버의 실제 경로인 '/api/image/'를 사용
          const transformedItem = {
            id: data.itemid || data.id,
            title: data.title,
            price: data.price,
            imageUrl: data.imageUrl ? `/api/image/${data.imageUrl}` : null,
            images:
              data.itemImages && data.itemImages.length > 0
                ? data.itemImages.map((imgFile) => `/api/image/${imgFile}`)
                : data.imageUrl
                ? [`/api/image/${data.imageUrl}`]
                : [],
            sellerId: data.sellerId,
            category: data.category,
            description: data.description,
            status: data.status,
            value: data.condition || data.value,
            place: data.meetLocation || "미정",
            tags: data.tags || [],
          };
          setItem(transformedItem);

          // ✅ 연관 상품 조회
          const relatedResponse = await api.get("/items/related", {
            params: {
              category: transformedItem.category,
              excludeId: transformedItem.id,
              limit: 5,
            },
          });
          setRelatedItems(relatedResponse.data);

          // ✅ 조회수 증가
          await api.post(`/items/${itemId}/view`);
        } catch (err) {
          console.error("데이터 조회 실패:", err);
          setError("상품 정보를 불러오는데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      };

      fetchItemAndRelatedData();
    }
  }, [itemId]);

  // ✅ 찜하기 기능
  const handleLikeClick = async () => {
    try {
      if (!currentUserId) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      const response = await api.post(`/items/like/${item?.id}`, null, {
        params: { userid: currentUserId },
      });
      alert(response.data.message || "찜 처리가 완료되었습니다.");
    } catch (err) {
      console.error("찜하기 실패:", err);
      alert("찜하기에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // ✅ 채팅방 생성 및 이동
  const handleStartChat = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ 백엔드 API 엔드포인트와 파라미터명 일치
      const requestData = {
        userId: currentUserId,
        otherUserId: item?.sellerId, // 실제 판매자 ID 사용
        itemId: Number(itemId)
      };

      console.log("채팅방 생성 요청 데이터:", requestData);

      const response = await api.post("/chat/rooms", requestData);

      console.log("채팅방 생성 응답:", response.data);

      // ✅ 채팅방 생성 성공 시 해당 채팅방으로 이동
      const chatRoomId = response.data.id;
      navigate(`/chat/${chatRoomId}?userId=${currentUserId}`);
    } catch (err) {
      setError("채팅방 생성에 실패했습니다.");
      console.error("채팅방 생성 실패:", err);
      console.error("에러 응답:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const images = item?.images?.filter((img) => img) || [
    "/assets/default-image.png",
  ];
  const prevImg = () =>
    setCurrent((current - 1 + images.length) % images.length);
  const nextImg = () => setCurrent((current + 1) % images.length);

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>로딩 중...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>
          오류 발생: {error}
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}>
            다시 시도
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.error}>상품 정보를 찾을 수 없습니다.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.detailContainer}>
        <div className={styles["image-slider"]}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={
                img && img.startsWith("http")
                  ? img
                  : `http://localhost:8080${img}`
              }
              alt={`상품이미지${idx + 1}`}
              className={`${styles["slider-image"]} ${
                current === idx ? styles["fade-in"] : styles["fade-out"]
              }`}
              style={{ left: 0, right: 0 }}
              onError={(e) => {
                e.target.src = "/assets/default-image.png";
              }}
            />
          ))}
          {images.length > 1 && (
            <>
              <button
                className={`${styles["slider-button"]} ${styles.left}`}
                onClick={prevImg}>
                &lt;
              </button>
              <button
                className={`${styles["slider-button"]} ${styles.right}`}
                onClick={nextImg}>
                &gt;
              </button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className={styles["indicator-dots"]}>
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`${styles.dot} ${
                  current === idx ? styles.active : ""
                }`}
                onClick={() => setCurrent(idx)}
              />
            ))}
          </div>
        )}
        <div className={styles["category-tag"]}>{item.category}</div>
        <div className={styles["seller-info"]}>
          <span>판매자:</span>
          <span className={styles["seller-name"]}>
            {item.sellerId || "학생1"}
          </span>
        </div>
        <div className={styles["item-title"]}>{item.title}</div>
        <div className={styles.price}>{item.price?.toLocaleString()}원</div>
        <div className={styles["description-text"]}>{item.description}</div>
        <div className={styles["item-condition"]}>{item.value}</div>
        <div className={styles["info-row"]}>
          <span>거래 장소: {item.place || "미정"}</span>
          <span>태그: {item.tags?.join(", ") || "없음"}</span>
        </div>
        <button className={styles["chat-button"]} onClick={handleStartChat}>
          채팅하기
        </button>
        <button className={styles["like-button"]} onClick={handleLikeClick}>
          찜하기
        </button>
        <div className={styles.relatedItem}>
          <div className={styles["related-title"]}>연관된 상품</div>
          {relatedItems.length > 0 ? (
            relatedItems.map((related) => (
              <ItemCard key={related.id} item={related} hideCompleted={true} />
            ))
          ) : (
            <div className={styles.noRelated}>관련 상품이 없습니다.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ItemDetailPage;
