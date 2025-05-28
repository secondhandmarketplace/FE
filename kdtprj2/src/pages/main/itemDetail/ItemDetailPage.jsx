import {useLocation, useNavigate } from "react-router-dom";
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import styles from "./itemDetail.module.css";
import {makeRoomIdFromItem} from "../../../utils/chatUtils.js";

function ItemDetailPage() {
    const location = useLocation();
    const item = location.state;
    const navigate = useNavigate();

    const handleChatClick = () => {
        const roomId = makeRoomIdFromItem(item);
        navigate("/chat", { state: { ...item, roomId } });
    };

    const handleLikeClick = () => {
        const likedItems = JSON.parse(localStorage.getItem("likedItems") || "[]");

        const exists = likedItems.some(i => i.id === item.id);
        if (exists) {
            alert("이미 찜한 상품입니다.");
            return;
        }

        likedItems.push(item);
        localStorage.setItem("likedItems", JSON.stringify(likedItems));
        alert("찜 목록에 추가되었습니다/");
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.detailContainer}>
                <div className={styles.imageContainer}>
                    <img src={item.imageUrl} width={90} height={90} alt="상품" />
                </div>
                <div className={styles.user}>학생1</div>
                <div className={styles.item}>
                    <h2>{item.title}</h2>
                    <p>가격: {item.price}</p>
                    <p>설명: {item.description}</p>
                    <div>
                        태그: {item.tags.join(", ")}
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={handleChatClick}>채팅하기</button>
                    <button onClick={handleLikeClick}>찜하기</button>
                </div>
                <div className={styles.place}>지도</div>
                <div className={styles.relatedItem}>비슷한거</div>
            </div>
            <Footer />
        </div>
    )
}

export default ItemDetailPage;
