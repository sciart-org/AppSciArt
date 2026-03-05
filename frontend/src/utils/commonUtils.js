export function itemsToUpperCase(list) {
    if (list === null) return null;
    return list.map((v) => toEnumValue(v));
};

export function toEnumValue(value) {
    return value ? value.trim().replaceAll(" ", "_").replaceAll("-", "_").toUpperCase() : null
}

export function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

export function toCamelCase(str) {
    return str
        .replace(/[-_ ]+([a-zA-Z0-9])/g, (_, letter) => letter.toUpperCase())
        .replace(/^[A-Z]/, (m) => m.toLowerCase())
        .replace("?", "");
}

export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });
}
