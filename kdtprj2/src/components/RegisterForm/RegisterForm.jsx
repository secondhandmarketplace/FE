import React, {useEffect, useState} from "react";
import styles from "./RegisterForm.module.css";
import { getUserId } from "../../utils/authUtils";

function RegisterForm({ onSubmit, initialItem, onSave }) {
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [tag, setTag] = useState("");
    const [description, setDescription] = useState("");

    const isTitleOver = title.length > 20;

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => ({ file, url: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...previews].slice(0, 10));
    };

    const handleRemoveImage = (index) => {
        const updated = [...images];
        URL.revokeObjectURL(updated[index].url);
        updated.splice(index, 1);
        setImages(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const tagArray = tag.split(" ").map(t => t.trim()).filter(t => t);
        const newItem = {
            id: initialItem ? initialItem.id : Date.now(),
            title,
            price: price === "" ? 0 : Number(price),
            tags: tagArray,
            description,
            imageUrl: images[0]?.url || initialItem?.imageUrl,
            status: initialItem?.status || "판매중",
            OwnerId: getUserId(),
        };

        if (initialItem) {
            onSave?.(newItem); // 수정
        } else {
            onSubmit?.(newItem); // 새로 등록
        }
    };


    useEffect(() => {
        if (initialItem) {
            setTitle(initialItem.title);
            setPrice(initialItem.price);
        }
    }, [initialItem]);

    return (
        <form className={styles.registerContainer} onSubmit={handleSubmit}>
                <div className={styles.imageContainer}>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden id="imageUploadInput" />
                    <label htmlFor="imageUploadInput" className={styles.imageGrid}>
                        {images.map((img, idx) => (
                            <div key={idx} className={styles.imageBox}>
                                <img src={img.url} alt={`upload-${idx}`} />
                                <button type="button" className={styles.removeBtn} onClick={() => handleRemoveImage(idx)} />
                            </div>
                        ))}
                        {images.length < 10 && <div className={styles.imageBox}><span className={styles.addIcon}>＋</span></div>}
                    </label>
                    <div className={styles.imageCount}>{images.length}/10</div>
                </div>

                <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    글 제목
                </label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
                {isTitleOver && <p className={styles.warning}>20자 이하로 입력해주세요 :)</p>}

                <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    가격
                </label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

                <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    태그
                </label>
                <input value={tag} onChange={(e) => setTag(e.target.value)} />

                <label className={styles.label}>
                    <span className={styles.required}>*</span>
                    설명
                </label>
                <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} />
            <button className={styles.registerButton} type="submit">{ initialItem? "수정하기" : "등록하기"}</button>
        </form>
    );
}

export default RegisterForm;
