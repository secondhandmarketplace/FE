import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header/Header";
import styles from "./signup.module.css";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Userid: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 필수값 체크: userid, password, confirmPassword
    if (!formData.Userid.trim()) {
      alert("아이디를 입력해주세요.");
      setLoading(false);
      return;
    }
    if (!formData.password.trim()) {
      alert("비밀번호를 입력해주세요.");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      const signupData = {
        userid: formData.Userid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/-/g, ""),
        password: formData.password,
        status: "active",
        mannerScore: 5.0,
      };

      const response = await api.post("/auth/signup", signupData);

      if (response.data && response.data.success) {
        alert("회원가입이 완료되었습니다!");
        navigate("/");
      } else {
        alert(response.data.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      console.error("회원가입 실패:", err);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.signupContainer}>
        <form onSubmit={handleSignup}>
          <div className={styles.labeledBox}>
            <span className={styles.boxLabel}>회원가입 정보</span>
            <div className={styles["info-input-box"]}>
              <input
                type="text"
                placeholder="아이디"
                value={formData.Userid}
                onChange={(e) => handleInputChange("Userid", e.target.value)}
                disabled={loading}
                className={styles.input}
                required
              />
              <input
                type="text"
                placeholder="이름"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={loading}
                className={styles.input}
              />
              <input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={loading}
                className={styles.input}
              />
              <input
                type="tel"
                placeholder="휴대폰 번호"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={loading}
                className={styles.input}
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={loading}
                className={styles.input}
                required
              />
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                disabled={loading}
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles["input-row"]}>
            <button
              type="submit"
              className={styles.signupBtn}
              disabled={loading}>
              {loading ? "회원가입 중..." : "회원가입"}
            </button>
          </div>
        </form>
        <div className={styles.signupFooter}>
          <span>이용약관 | 개인정보처리방침</span>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
