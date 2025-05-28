export const getUser = () => {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

export const getUserId = () => {
    const user = getUser();
    return String(user?.userId || '');
}