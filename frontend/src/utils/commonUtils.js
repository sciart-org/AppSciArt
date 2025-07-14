export function itemsToUpperCase(list) {
    if (list === null) return null;
    return list.map((v) => v.toUpperCase());
};

export function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}