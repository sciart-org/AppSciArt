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
    const withNullDefaults = ([key, value]) => [
        key,
        value === undefined || value === '' ? null : value
    ];

    const entries = Object.entries(obj).map(withNullDefaults);
    return { ...Object.fromEntries(entries), ...overrides };
}

const resolveFormInputValue = async (input) => {
    if (input.type === "file") return await fileToBase64(input.files[0]);
    if (input.type === "checkbox") return input.checked;
    return input.value;
};

export async function handleFormInputChange(e, setFormData) {
    const newValue = await resolveFormInputValue(e.target);
    setFormData((prev) => ({ ...prev, [e.target.name]: newValue }));
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

export function simulateInputChange(name, value, handleInputChange) {
    return handleInputChange({
        target: { name, type: "text", value },
    });
}

export function filterNotChangedFields(newValues, previousValues) {
    return Object.entries(newValues).reduce((editedFields, [key, value]) => {
        const prevValue = previousValues[key];

        if (key.toLowerCase().includes("date")) {
            const valNormalized = new Date(value).toISOString().slice(0, 10);
            const prevNormalized = new Date(prevValue).toISOString().slice(0, 10);
            if (valNormalized === prevNormalized) return editedFields;
        } else if (value === prevValue) {
            return editedFields;
        }

        editedFields[key] = key === "year" ? parseInt(value) : value;
        return editedFields;
    }, {});
};

export function getFullParticipantName(participant) {
    if (!participant) return
    return `${participant.userProfile.name} ${participant.userProfile.surname}`
}

export function getFullUserName(user) {
    if (!user) return
    return `${user.name} ${user.surname}`
}

export function sortParticipantsBySurname(participants) {
    if (!participants) return
    return participants.sort((a, b) => a.userProfile.surname.localeCompare(b.userProfile.surname))
}

export function sortUsersBySurname(users) {
    if (!users) return
    return users.sort((a, b) => a.surname.localeCompare(b.surname))
}