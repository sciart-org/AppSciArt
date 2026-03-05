export function itemsToUpperCase(list) {
    if (list === null) return null;
    return list.map((v) => toEnumValue(v));
};

export function toEnumValue(value) {
    return value ? value.trim().replaceAll(" ", "_").replaceAll("-", "_").toUpperCase() : null
}

export function parseEnumValue(value) {
    return value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase().replaceAll("_", " ");
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

export function getFormData(obj, overrides = {}) {
    const withNullDefaults = ([key, value]) => [key, value ?? null];
    const entries = Object.entries(obj).map(withNullDefaults);

    return { ...Object.fromEntries(entries), ...overrides };
};

const resolveFormInputValue = async ({ type, files, value, checked }) => {
    if (type === "file") return await fileToBase64(files[0]);
    if (type === "checkbox") return checked;
    return value;
};

export async function handleFormInputChange(e, setFormData) {
    const { name, ...inputProps } = e.target;
    const newValue = await resolveFormInputValue(inputProps);
    setFormData((prev) => ({ ...prev, [name]: newValue }));
};

export function formatReadableDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function scrollToTop(topValue) {
    return window.scrollTo({ top: topValue, left: 0, behavior: "instant" });
}