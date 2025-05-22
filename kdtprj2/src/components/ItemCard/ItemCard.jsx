import React from "react";
import { useNavigate} from "react-router-dom";
import styles from "./ItemCard.module.css";
import Tag from "../Tag/Tag";

function ItemCard({item}) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/item/${item.id}`, { state: item});
    };

    return (
        <div className={styles.card} onClick={handleClick}>
            <div className={styles.imageWrapper}>
                <img src={item.imageUrl} alt="상품" />
                {item.status === "거래완료" && (
                    <div className={styles.overlay}>거래 완료</div>
                )}
            </div>
            <div className={styles.content}>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.price}>{item.price}</p>
                <div className={styles.tags}>
                    {item.tags.map((tag, idx) => (
                        <Tag key={idx} text={tag} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ItemCard;