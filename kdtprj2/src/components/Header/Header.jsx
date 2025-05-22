import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./header.module.css";

function Header() {
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

    if (location.pathname === "/home") {
        return (
            <header className={styles.homeHeader}></header>
        );
    }

    if (location.pathname === "/register") {
        return (
            <header className={styles.registerHeader}>
                <button className={styles.backBtn} onClick={() => navigate('/home')}></button>
                상품 등록</header>
        );
    }

    if (location.pathname .startsWith("/item/")) {
        return (
            <header className={styles.itemDetailHeader}>
                <button className={styles.backBtn} onClick={() => navigate('/login')}></button>
                상세 페이지</header>
        );
    }

    if (location.pathname === "/chat") {
        return (
            <header className={styles.chatHeader}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}></button>
                상대방</header>
        )
    }

    if (location.pathname === "/chatList") {
        return (
            <header className={styles.chatListHeader}>채팅 목록</header>
        )
    }
    return (
        <header className= {styles.header}>
            <h1>기본 헤더</h1>
        </header>
    );
}

export default Header;