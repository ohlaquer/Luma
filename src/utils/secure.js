// src/utils/secure.js
import CryptoJS from "crypto-js";
console.log("🌍 import.meta.env =", import.meta.env);

// 🔑 Один спільний ключ для всього фронтенду
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "YourSecretKey123";

console.log("🧠 SECRET_KEY IN USE:", SECRET_KEY);
/**
 * Шифрує текст за допомогою AES
 * @param {string} text
 * @returns {string} ciphertext
 */
export function encrypt(text) {
    try {
        if (!text) return "";
        return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    } catch (err) {
        console.error("❌ Encryption failed:", err);
        return "";
    }
}

/**
 * Розшифровує AES-текст
 * @param {string} ciphertext
 * @returns {string} plain text
 */

console.log("🔑 ENCRYPTION KEY:", import.meta.env.VITE_ENCRYPTION_KEY);

export function decrypt(ciphertext) {
    try {
        if (!ciphertext) return "";

        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const plain = bytes.toString(CryptoJS.enc.Utf8);

        // якщо не вдалось розшифрувати – швидше за все це був звичайний текст
        if (!plain) {
            return ciphertext;
        }

        return plain;
    } catch (err) {
        console.error("❌ Decryption failed:", err);
        // теж повертаємо оригінал, а не "[Помилка...]"
        return ciphertext;
    }
}


/**
 * Для JSON-об’єктів: шифрує об’єкт у строку
 * @param {object} obj
 */
export function encryptJSON(obj) {
    try {
        return encrypt(JSON.stringify(obj));
    } catch (err) {
        console.error("❌ JSON encryption failed:", err);
        return "";
    }
}

/**
 * Для JSON-об’єктів: розшифровує назад у об’єкт
 * @param {string} ciphertext
 */
export function decryptJSON(ciphertext) {
    try {
        const plain = decrypt(ciphertext);
        return JSON.parse(plain);
    } catch (err) {
        console.error("❌ JSON decryption failed:", err);
        return {};
    }
}
// 🔍 Дебаг у браузері
if (typeof window !== "undefined") {
    window._enc = encrypt;
    window._dec = decrypt;
    console.log("🧩 Debug AES helpers attached to window: _enc(), _dec()");
}
