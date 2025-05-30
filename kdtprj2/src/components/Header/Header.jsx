import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./header.module.css";

function Header({onSearchClick, onExitSearch}) {
    const location = useLocation();
    const navigate = useNavigate();

    if (location.pathname === '/login') return null;

    if (location.pathname === "/signup") {
        return (
            <header className={styles.signupHeader}>
                <button className={styles.backBtn} onClick={() => navigate('/login')}></button>
                회원가입
            </header>
        );
    }

    if (location.pathname === '/mypage') {
        return (
            <header className={styles.Header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}></button>
                마이 페이지
            </header>
        )
    }

    if (location.pathname === '/home') {
        return (
            <header className={styles.homeHeader}>
                <button className={styles.backBtn} onClick={onExitSearch}></button>
                <button className={styles.searchBtn} onClick={onSearchClick} >
                    <img src="/search.svg" alt="검색버튼" />
                </button>
            </header>
        )
    }

    if (location.pathname === "/chatList") {
        return (
            <header className={styles.Header}></header>
        );
    }

    if (location.pathname === "/register") {
        return (
            <header className={styles.Header}>
                <button className={styles.backBtn} onClick={() => navigate('/home')}></button>
                상품 등록
            </header>
        );
    }

    if (location.pathname .startsWith("/item/")) {
        return (
            <header className={styles.Header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}></button>
                상세 페이지
            </header>
        );
    }

    if (location.pathname === "/chat") {
        return (
            <header className={styles.Header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}></button>
                상대방
            </header>
        )
    }

    if (location.pathname === "/history/liked") {
        return (
            <header className={styles.Header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}></button>
                찜 목록
            </header>
        )
    }

    if (location.pathname === "/history/sales") {
        return (
            <header className={styles.Header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}></button>
                판매 내역
            </header>
        )
    }

    if (location.pathname === "/history/viewed") {
        return (
            <header className={styles.Header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}></button>
                최근 본 상품
            </header>
        )
    }

    if (location.pathname === "/history/purchased") {
        return (
            <header className={styles.Header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}></button>
                구매 내역
            </header>
        )
    }

    return (
        <header className= {styles.basicHeader}>
            <h1>기본 헤더</h1>
        </header>
    );
}

export default Header;