import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./login.module.css";
import ProfileImage from "../../../components/ProfileImage.jsx";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 완전한 로그아웃 함수
  const clearAllAuthData = () => {
    const authKeys = [
      "user",
      "token",
      "userId",
      "senderId",
      "userName",
      "userEmail",
      "userPhone",
      "userStatus",
      "mannerScore",
    ];

    authKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    // axios 헤더에서 토큰 제거
    delete api.defaults.headers.common["Authorization"];

    console.log("모든 인증 데이터 삭제 완료");
  };

  // 자동 로그인 체크 (페이지 로드 시)
  useEffect(() => {
    const checkAutoLogin = () => {
      // URL에서 logout 파라미터 확인
      const urlParams = new URLSearchParams(location.search);
      const isLogout = urlParams.get("logout") === "true";

      if (isLogout) {
        // 로그아웃 요청이면 모든 데이터 삭제
        clearAllAuthData();
        console.log("로그아웃 처리 완료");
        return;
      }

      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      // 둘 다 있고, 유효한 경우에만 자동 로그인
      if (savedUser && savedToken) {
        try {
          const user = JSON.parse(savedUser);

          // 사용자 상태 확인
          if (user.status === "active" && user.userid && user.name) {
            console.log("자동 로그인:", user.name);
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${savedToken}`;
            navigate("/home");
          } else {
            console.log("유효하지 않은 사용자 정보");
            clearAllAuthData();
          }
        } catch (error) {
          console.error("저장된 사용자 정보 파싱 오류:", error);
          clearAllAuthData();
        }
      } else {
        console.log("저장된 로그인 정보 없음");
      }
    };

    checkAutoLogin();
  }, [navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userid.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. 먼저 사용자 존재 여부 확인
      const userCheckResponse = await api.get(`/users/${userid.trim()}/check`);

      if (userCheckResponse.status === 404) {
        setError("존재하지 않는 사용자입니다.");
        setLoading(false);
        return;
      }

      const user = userCheckResponse.data;

      // 2. 비밀번호 확인 (실제로는 백엔드에서 암호화된 비밀번호와 비교해야 함)
      if (user.password !== password) {
        setError("비밀번호가 일치하지 않습니다.");
        setLoading(false);
        return;
      }

      // 3. 사용자 상태 확인
      if (user.status === "blocked" || user.status === "suspended") {
        setError("계정이 제한되었습니다. 관리자에게 문의하세요.");
        setLoading(false);
        return;
      }

      // 4. 로그인 성공 - localStorage에 저장
      const token = `fake-jwt-token-${user.userid}`; // 실제로는 서버에서 받아야 함

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.userid);
      localStorage.setItem("senderId", user.userid);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userPhone", user.phone || "");
      localStorage.setItem("userStatus", user.status || "active");
      localStorage.setItem("mannerScore", user.mannerScore || "5.0");

      // axios 헤더에 토큰 설정
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("로그인 성공:", user.name);
      alert(`${user.name}님, 환영합니다!`);
      navigate("/home");
    } catch (err) {
      console.error("로그인 실패:", err);

      if (err.response) {
        const status = err.response.status;

        if (status === 404) {
          setError("존재하지 않는 사용자입니다.");
        } else if (status >= 500) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError("로그인에 실패했습니다.");
        }
      } else if (err.code === "ECONNABORTED") {
        setError("요청 시간이 초과되었습니다. 네트워크를 확인해주세요.");
      } else if (err.code === "ERR_NETWORK") {
        setError("네트워크 연결을 확인해주세요.");
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 회원가입 버튼 클릭
  const handleSignUpClick = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  // 비밀번호 찾기 버튼 클릭
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    navigate("/forgot");
  };

  // 아이디 형식 검증
  const validateUserid = (userid) => {
    const useridRegex = /^[a-zA-Z0-9]{4,20}$/;
    return useridRegex.test(userid);
  };

  // 실시간 입력 검증
  const handleUseridChange = (e) => {
    const value = e.target.value;
    setUserid(value);

    if (value && !validateUserid(value)) {
      setError("아이디는 4-20자의 영문, 숫자만 가능합니다.");
    } else {
      setError("");
    }
  };

  // 개발자용 디버깅 함수 (개발 중에만 사용)
  const handleDebugClear = () => {
    clearAllAuthData();
    alert("모든 로그인 정보가 삭제되었습니다.");
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.basicProfile}>
          <ProfileImage />
        </div>

        <form className={styles.inputContainer} onSubmit={handleLogin}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <input
            type="text"
            name="userid"
            className={styles.enterID}
            placeholder="아이디를 입력하세요"
            value={userid}
            onChange={handleUseridChange}
            disabled={loading}
            required
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            className={styles.enterPW}
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="current-password"
          />
          <div className={styles["login-btn-row"]}>
            <button
              type="button"
              className={styles.signUp}
              onClick={handleSignUpClick}
              disabled={loading}>
              회원가입
            </button>
            <button
              type="button"
              className={styles.forgotPW}
              onClick={handleForgotPasswordClick}
              disabled={loading}>
              비밀번호 찾기
            </button>
          </div>
          <button
            type="submit"
            className={styles["login-btn"]}
            disabled={loading || !userid || !password}>
            {loading ? "로그인 중..." : "로그인"}
          </button>

          {/* 개발 중에만 표시 - 배포 시 제거 */}
          {process.env.NODE_ENV === "development" && (
            <button
              type="button"
              onClick={handleDebugClear}
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                background: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
              }}>
              디버그: 로그인 정보 삭제
            </button>
          )}
        </form>
      </div>
    </>
  );
}

export default LoginPage;
