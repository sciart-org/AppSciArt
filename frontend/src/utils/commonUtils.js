export function itemsToUpperCase(list) {
    if (list === null) return null;
    return list.map((v) => toEnumValue(v));
};

export function toEnumValue(value) {
    return value ? value.trim().replaceAll(" ", "_").toUpperCase() : null
}

export function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}