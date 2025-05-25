import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import ProfileImage from '../../components/ProfileImage';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();

        if (response.ok && data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home");
        } else alert("로그인 실패");
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.basicProfile}>
                    <ProfileImage />
                </div>

                <form className={styles.inputContainer} onSubmit={handleLogin}>
                    <input
                        type="text"
                        name="email"
                        className={styles.enterID}
                        placeholder="ID"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        className={styles.enterPW}
                        placeholder="PW"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className={styles.btnContainer}>
                        <button className={styles.signUp} onClick={() => navigate("/signup")}>회원가입</button>
                        <button className={styles.forgotPW} onClick={() => navigate("/forgot")}>비밀번호 찾기</button>
                    </div>
                    <button type="submit" className={styles.loginBtn}> 로그인 </button>
                </form>
            </div>
        </>

    )
}

export default LoginPage;