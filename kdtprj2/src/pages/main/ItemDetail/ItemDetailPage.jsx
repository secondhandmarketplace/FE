import {useLocation, useNavigate, useParams} from "react-router-dom";
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import styles from "./detail.module.css";
import {makeRoomIdFromItem} from "../../../utils/chatUtils.js";

function ItemDetailPage() {
    const location = useLocation();
    const { id } = useParams();
    const item = location.state;
    const navigate = useNavigate();

    const handleChatClick = () => {
        const roomId = makeRoomIdFromItem(item);
        navigate("/chat", { state: { ...item, roomId } });
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.detailContainer}>
                <div className={styles.imageContainer}>
                    <img src={item.imageUrl} alt="상품" />
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
                    <button>찜하기</button>
                </div>
                <div className={styles.place}>지도</div>
                <div className={styles.relatedItem}>비슷한거</div>
            </div>
            <Footer />
        </div>
    )
}

export default ItemDetailPage;
