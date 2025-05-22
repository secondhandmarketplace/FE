import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import Header from '../../../components/Header/Header.jsx';
import TagComponent from "../../../components/Tag/Tag.jsx";

function RegisterPage() {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [tag, setTag] = useState("");
    const [description, setDescription] = useState("");

    const isTitleOver = title.length > 20;

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImagePreviews = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        // 최대 10장 제한
        const total = [...images, ...newImagePreviews].slice(0, 10);
        setImages(total);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].url); // 메모리 해제
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = () => {
        const tagArray = tag
            .split(" ")
            .map(t => t.trim())
            .filter(t => t);

        const newItem = {
            id: Date.now(),
            title,
            price: Number(price),
            tags: tagArray,
            description,
            imageUrl: "/cat1.svg",
            status: "판매중",
        };

        const saved = JSON.parse(localStorage.getItem("items") || "[]");
        localStorage.setItem("items", JSON.stringify([...saved, newItem]));
        navigate("/home");
    };

    // const formData = new FormData();
    // formData.append('title', title);
    // formData.append('price', price);
    // formData.append('description', description);
    // images.forEach((img, idx) => {
    //     formData.append('images', img.file); // 보통 서버에서는 배열로 처리
    // });
    //
    // await axios.post('/api/items', formData);

    // const res = await axios.post("/api/items", formData);
    // const newItem = res.data;
    //
    // navigate("/home", { state: newItem });

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.Wrapper}>
                <div className={styles.registerContainer}>
                    <div className={styles.imageContainer}>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="imageUploadInput"
                        />
                        <label htmlFor="imageUploadInput" className={styles.imageGrid}>
                            {images.map((img, idx) => (
                                <div key={idx} className={styles.imageBox}>
                                    <img src={img.url} alt={`upload-${idx}`} />
                                    <button
                                        type="button"
                                        className={styles.removeBtn}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveImage(idx);
                                        }}
                                    >
                                    </button>
                                </div>
                            ))}
                            {images.length < 10 && (
                                <div className={styles.imageBox}>
                                    <span className={styles.addIcon}>＋</span>
                                </div>
                            )}
                        </label>
                        <div className={styles.imageCount}>{images.length}/10</div>
                    </div>

                    <label className={styles.label}>
                        <span className={styles.required}>*</span> 글 제목
                    </label>
                    <input
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="최대 20자까지 입력 가능합니다"
                    />
                    {isTitleOver && (
                        <p className={styles.warning}>
                            (20자 초과인 경우) * 20자 이하로 입력해주세요 :)
                        </p>
                    )}

                    <label className={styles.label}>
                        <span className={styles.required}>*</span> 가격
                    </label>
                    <input
                        type={"number"}
                        className={styles.input}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0 으로 기입시 무료 나눔으로 분류됩니다"
                    />

                    <label className={styles.label}>
                        <span className={styles.required}>*</span> 태그 입력
                    </label>
                    <input
                        className={styles.input}
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder="#중고"
                    />

                    <label className={styles.label}>
                        <span className={styles.required}>*</span> 게시글 작성
                    </label>

                    <textarea
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="상품을 설명해주세요"
                    />
                </div>

                <button className={styles.registerButton} onClick={handleSubmit}>등록하기</button>
            </div>
        </div>
    );
}

export default RegisterPage;