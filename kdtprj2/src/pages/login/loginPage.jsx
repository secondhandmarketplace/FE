import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import ProfileImage from '../../components/ProfileImage';

function LoginPage() {
    const navigate = useNavigate();

    return (
        <>
            <div className={styles.container}>
                <div className={styles.basicProfile}>
                    <ProfileImage />
                </div>
                <div className={styles.inputContainer}>
                    <input type="text" className={styles.enterID} placeholder="ID"></input>
                    <input type="password" className={styles.enterPW} placeholder="PW"></input>
                    <div className={styles.btnContainer}>
                        <button className={styles.signUp} onClick={() => navigate("/signup")}>회원가입</button>
                        <button className={styles.forgotPW} onClick={() => navigate("/forgot")}>비밀번호 찾기</button>
                    </div>
                    <button className={styles.loginBtn}> 로그인 </button>
                </div>
            </div>
        </>

    )
}

export default LoginPage;