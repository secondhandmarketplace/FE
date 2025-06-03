// utils/authUtils.js
export const getUserId = () => {
  // 여러 방법으로 사용자 ID 확인
  const userId =
    localStorage.getItem("userId") || localStorage.getItem("senderId");

  if (!userId) {
    console.error("사용자 ID를 찾을 수 없습니다.");
    return null;
  }

  console.log("현재 사용자 ID:", userId);
  return userId;
};

// 사용자 로그인 상태 확인
export const isLoggedIn = () => {
  const user = localStorage.getItem("user");
  const userId = getUserId();
  return !!(user && userId);
};

// 현재 사용자 정보 반환
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("사용자 정보 파싱 오류:", error);
    return null;
  }
};
