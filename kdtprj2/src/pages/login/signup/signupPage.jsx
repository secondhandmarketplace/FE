import React from "react";
import styles from "./signup.module.css";
import Header from '../../../components/Header/Header.jsx';
import Footer from '../../../components/Footer/Footer.jsx';

function SignupPage() {

    return (
        <>
            <div className={styles.container}>
                <Header />
                <div className={styles.signupContainer}>
                    <div className={styles.labeledBox}>
                        <span className={styles.boxLabel}>대학생 인증</span>
                        <div className={styles.authContainer}>
                            <input type="text" placeholder="학교명을 입력하세요." />
                            <button>인증</button>
                        </div>
                    </div>

                    <div className={styles.labeledBox}>
                        <span className={styles.boxLabel}>회원 정보 입력</span>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputRow}>
                                <input type="text" placeholder="email 형식으로 입력하세요" />
                                <button>중복확인</button>
                            </div>

                            <input type="password" placeholder="특수 문자, 영어, 숫자 포함 6자 이상" />
                            <input type="password" placeholder="비밀번호를 한 번 더 입력하세요" />

                            <div className={styles.inputRow}>
                                <input placeholder="닉네임을 입력하세요" />
                                <button>중복확인</button>
                            </div>

                            <input placeholder="010-0000-0000" />

                            <div className={styles.inputRow}>
                                <input placeholder="주소를 입력하세요" />
                                <button>주소찾기</button>
                            </div>
                        </div>

                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default SignupPage;