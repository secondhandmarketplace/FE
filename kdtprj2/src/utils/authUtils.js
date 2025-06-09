/**
 * ✅ 사용자 ID 조회 (Java Spring 환경 반영)
 */
export const getUserId = () => {
  try {
    const userId =
      localStorage.getItem("userId") ||
      localStorage.getItem("senderId") ||
      sessionStorage.getItem("userId");

    // ✅ 하드코딩된 값 완전 차단
    if (
      !userId ||
      userId === "null" ||
      userId === "undefined" ||
      userId === "guest"
    ) {
      console.warn("유효하지 않은 사용자 ID 감지:", userId);
      return null;
    }
    console.log("유효한 사용자 ID:", userId);
    return userId;
  } catch (error) {
    console.error("사용자 ID 조회 중 오류:", error);
    return null;
  }
};

/**
 * ✅ 사용자 ID 설정
 */
export const setUserId = (userId) => {
  try {
    if (!userId || userId === "undefined" || userId === "null") {
      console.error("유효하지 않은 사용자 ID:", userId);
      return false;
    }
    localStorage.setItem("userId", userId);
    localStorage.setItem("senderId", userId);
    sessionStorage.setItem("userId", userId);
    console.log("사용자 ID 설정 완료:", userId);
    return true;
  } catch (error) {
    console.error("사용자 ID 설정 중 오류:", error);
    return false;
  }
};

/**
 * ✅ 사용자 정보 전체 설정
 */
export const setUserInfo = (userInfo) => {
  try {
    console.log("사용자 정보 저장 시작:", userInfo);
    if (!userInfo || !userInfo.userid) {
      console.error("유효하지 않은 사용자 정보:", userInfo);
      return false;
    }
    setUserId(userInfo.userid);
    if (userInfo.token) {
      localStorage.setItem("token", userInfo.token);
      sessionStorage.setItem("token", userInfo.token);
    }
    if (userInfo.name) {
      localStorage.setItem("userName", userInfo.name);
      sessionStorage.setItem("userName", userInfo.name);
    }
    if (userInfo.loginTime) {
      localStorage.setItem("loginTime", userInfo.loginTime);
    } else {
      localStorage.setItem("loginTime", new Date().toISOString());
    }
    localStorage.setItem("messagingEnabled", "true");
    localStorage.setItem("aiEnabled", "true");
    console.log("사용자 정보 저장 완료:", {
      userid: userInfo.userid,
      hasToken: !!userInfo.token,
      hasName: !!userInfo.name,
      loginTime: userInfo.loginTime,
    });
    return true;
  } catch (error) {
    console.error("사용자 정보 저장 중 오류:", error);
    return false;
  }
};

/**
 * ✅ 사용자 정보 조회
 */
export const getUserInfo = () => {
  try {
    const userId = getUserId();
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const loginTime = localStorage.getItem("loginTime");
    if (!userId) return null;
    return {
      userid: userId,
      token: token,
      name: userName,
      loginTime: loginTime,
      messagingEnabled: localStorage.getItem("messagingEnabled") === "true",
      aiEnabled: localStorage.getItem("aiEnabled") === "true",
    };
  } catch (error) {
    console.error("사용자 정보 조회 중 오류:", error);
    return null;
  }
};

/**
 * ✅ 토큰 관리
 */
export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    sessionStorage.setItem("token", token);
    console.log("토큰 저장 완료");
  }
};

export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

/**
 * ✅ 로그인 상태 확인 (Java Spring 환경)
 */
export const isAuthenticated = () => {
  const userId = getUserId();
  const token = getToken();
  const isAuth = userId && userId !== "null" && userId !== "undefined" && token;
  console.log(
    "로그인 상태 확인:",
    isAuth,
    "userId:",
    userId,
    "hasToken:",
    !!token
  );
  return isAuth;
};

/**
 * ✅ 인증 정보 삭제 (로그아웃)
 */
export const clearAuth = () => {
  try {
    localStorage.removeItem("userId");
    localStorage.removeItem("senderId");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("messagingEnabled");
    localStorage.removeItem("aiEnabled");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");
    console.log("인증 정보 삭제 완료");
    return true;
  } catch (error) {
    console.error("인증 정보 삭제 중 오류:", error);
    return false;
  }
};

/**
 * ✅ 사용자별 설정 관리 (대화형 AI 지원)
 */
export const updateUserPreferences = (preferences) => {
  try {
    const userId = getUserId();
    if (!userId) return false;
    const userPrefs = {
      ...preferences,
      userid: userId,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`userPrefs_${userId}`, JSON.stringify(userPrefs));
    console.log("사용자 설정 업데이트 완료:", userPrefs);
    return true;
  } catch (error) {
    console.error("사용자 설정 업데이트 실패:", error);
    return false;
  }
};

export const getUserPreferences = () => {
  try {
    const userId = getUserId();
    if (!userId) return null;
    const saved = localStorage.getItem(`userPrefs_${userId}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("사용자 설정 조회 실패:", error);
    return null;
  }
};
