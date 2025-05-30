import React, {useRef, useState} from "react";
import Header from "../../../components/Header/Header.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import styles from "./MyPage.module.css";
import {Link} from "react-router-dom";
import { handleSave } from "../../../utils/handleSave.js";
import {useNavigate} from "react-router-dom";
import Modal from "../../../components/Modal/Modal.jsx";
import {getUserId} from "../../../utils/authUtils.js";
import Address from "../../../components/Address/Address.jsx";

function MyPage() {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const userId = getUserId();

    return (
        <div className={styles.container} ref={containerRef}>
            <Header />
            <>
                <div className={styles.myPage}>
                    {isEditing ? (
                        <>
                            <div className={styles.inputBox}>
                                <div className={styles.inputRow}>
                                    <label>
                                        <span className={styles.required}>*</span>
                                        비밀번호 수정
                                    </label>
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="비밀번호를 입력하세요"/>
                                </div>

                                <div className={styles.inputRow}>
                                    <label>
                                        <span className={styles.required}>*</span>
                                        비밀번호 확인
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="비밀번호를 다시 입력하세요"/>
                                </div>

                                <div className={styles.inputRow}>
                                    <label>
                                        <span className={styles.required}>*</span>
                                        닉네임 수정
                                    </label>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={e => setNickname(e.target.value)}
                                        placeholder="닉네임을 입력하세요"/>
                                </div>

                                <div className={styles.inputRow}>
                                    <label>
                                        <span className={styles.required}>*</span>
                                        연락처 수정
                                    </label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="연락처를 입력하세요"/>
                                    <button>중복 확인</button>
                                </div>
                                <div className={styles.addressBox}>
                                    <label>
                                        <span className={styles.required}>*</span>
                                        주소 수정
                                    </label>
                                    <Address value={address}
                                             onAddressSelected={setAddress}/>
                                </div>
                            </div>
                            <div className={styles.btnBox}>
                                <button
                                    onClick={() => handleSave({
                                        password,
                                        confirmPassword,
                                        nickname,
                                        phone,
                                        address,
                                        setIsEditing
                                    })}>
                                    저장
                                </button>
                                <button onClick={() => setIsEditing(false)}>취소</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.infoBox}>
                                회원 정보(닉네임,학교명)
                                <button onClick={() => setIsEditing(true)}>수정하기</button>
                            </div>

                            <div className={styles.historyBox}>
                                <Link to="/history/viewed" className={styles.historyItem}>상품 조회 내역</Link>
                                <Link to="/history/liked" className={styles.historyItem}>찜 목록</Link>
                                <Link to="/history/sales" className={styles.historyItem}>판매 내역</Link>
                                <Link to="/history/purchased" className={styles.historyItem}>구매 내역</Link>
                            </div>

                            <div className={styles.btnBox}>
                                <button onClick={() => navigate("/login")}>로그아웃</button>
                                <button onClick={()=> setIsOpen(true)}>회원탈퇴</button>
                            </div>
                        </>
                    )}
                </div>
            </>
            {isOpen && (
                <Modal
                    onConfirm={() => {
                        localStorage.removeItem("user");

                        const allItems = JSON.parse(localStorage.getItem("items") || "[]");
                        const filteredItems = allItems.filter(item => item.OwnerId !== userId);
                        localStorage.setItem("items", JSON.stringify(filteredItems));

                        navigate("/login");
                    }}
                    onCancel={() => setIsOpen(false)}
                />
            )}
            <Footer />
        </div>
    )
}

export default MyPage;
