const generateId = () => {
    const random = Math.random().toString(32).substring(2);
    const plus = Date.now().toString(32);
    return random + plus;
};

export default generateId;