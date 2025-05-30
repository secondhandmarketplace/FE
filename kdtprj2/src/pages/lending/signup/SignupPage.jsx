import React, { useState } from "react";
import styles from "./signup.module.css";
import { useNavigate } from "react-router-dom";
import Header from '../../../components/Header/Header.jsx';
import { signupForm } from "../../../utils/signupForm.js";
import { handleSignup } from "../../../utils/handleSignup.js";
import {isSignupFormValid} from "../../../utils/validationForm.js";
import Address from "../../../components/Address/Address.jsx";

function SignupPage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState("");
    const [form, setForm] = useState(signupForm)

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleAddress = (fullAddress) => {
        setForm((prev) => ({
            ...prev,
            address: fullAddress,
        }));
        console.log("ㅅㅓㄴ택한 주소: ",fullAddress);
    }

    return (
        <>
            <div className={styles.container}>
                <Header />
                <form className={styles.signupContainer} onSubmit={async (e) => {
                    e.preventDefault();
                    await handleSignup({form, setUserId, setMessage, navigate });
                }}>
                    <div className={styles.labeledBox}>
                        <span className={styles.boxLabel}>대학생 인증</span>
                        <div className={styles.authContainer}>
                            <input
                                type="text"
                                name="school"
                                placeholder="학교명을 입력하세요."
                                value={form.school}
                                onChange={handleChange}
                            />
                            {/* 인증할 줄 몰라서 비활성화 */}
                            <button type="button" disabled>인증</button>
                        </div>
                    </div>

                    <div className={styles.labeledBox}>
                        <span className={styles.boxLabel}>회원 정보 입력</span>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputRow}>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="email 형식으로 입력하세요"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button">중복확인</button>
                            </div>

                            <input
                                type="password"
                                name="password"
                                placeholder="특수 문자, 영어, 숫자 포함 6자 이상"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="passwordConfirm"
                                placeholder="비밀번호를 한 번 더 입력하세요"
                                value={form.passwordConfirm}
                                onChange={handleChange}
                                required
                            />

                            <div className={styles.inputRow}>
                                <input
                                    name="nickname"
                                    placeholder="닉네임을 입력하세요"
                                    value={form.nickname}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button">중복확인</button>
                            </div>

                            <input
                                name="phone"
                                placeholder="010-0000-0000"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />

                            <Address value={form.address} onAddressSelected={handleAddress} />
                        </div>

                    </div>
                    {message && <div className={styles.message}>{message}</div>}
                    {userId && <div className={styles.userId}>발급된 userId: {userId}</div>}

                    <div className={styles.signupFooter}>
                        <button
                            type="submit"
                            className={`${styles.signupBtn} ${!isSignupFormValid(form) ? styles.disabled : ""}`}
                            disabled = {!isSignupFormValid(form)}
                        >
                            회원가입하기
                        </button>
                    </div>
                </form>

            </div>
        </>
    )
}

export default SignupPage;