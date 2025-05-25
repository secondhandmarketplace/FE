export const handleSignup = async ({ form, setUserId ,setMessage ,navigate}) => {
    if (!form.email.includes("@")) {
        setMessage("올바른 이메일 형식을 입력하세요.");
        return;
    }
    if (form.password.length < 6) {
        setMessage("비밀번호는 6자 이상이어야 합니다.");
        return;
    }
    if (form.password !== form.passwordConfirm) {
        setMessage("비밀번호가 일치하지 않습니다.");
        return;
    }

    try {
        const response = await fetch("/api/user/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if (response.ok && data.userId) {
            const userData = {
                userId: data.userId,
                nickname: form.nickname,
                email: form.email,
                phone: form.phone,
                address: form.address,
                school: form.school,
            };

            localStorage.setItem("user", JSON.stringify(userData));
            setUserId(data.userId);
            setMessage("회원가입이 완료되었습니다.");
            navigate("/login");
        } else {
            setMessage(data.message || "회원가입 실패");
        }
    } catch (error) {
        setMessage("서버 에러");
    }
};