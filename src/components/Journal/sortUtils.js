// ------------------------------
// 🔧 Extract date
// ------------------------------
export function extractDate(entry) {
    const d = entry?.dateISO || entry?.date;
    const dt = d ? new Date(d) : new Date(0);
    return isNaN(dt.getTime()) ? new Date(0) : dt;
}

// ------------------------------
// 🔧 Word count helper
// ------------------------------
export function wordCount(entry) {
    const plain = entry?.plain || entry?.plainText || "";
    if (plain) {
        return plain.trim().split(/\s+/).filter(Boolean).length;
    }

    const html = entry?.html || "";
    const text = html.replace(/<[^>]+>/g, " ");
    return text.trim().split(/\s+/).filter(Boolean).length;
}

// ------------------------------
// 🔧 Mood score (0 — погано, 6 — дуже добре)
// ------------------------------
export function moodScore(entry) {
    const idx = entry?.moodMeta?.moodIndex;
    if (typeof idx === "number") return idx;

    const label = (entry?.moodMeta?.moodLabel || entry?.moodMeta?.label || "").toLowerCase();

    if (/дуже\s*погано|terrible|awful/.test(label)) return 0;
    if (/погано|bad/.test(label)) return 1;
    if (/скоріше\s*погано|rather bad/.test(label)) return 2;
    if (/нейтрально|neutral/.test(label)) return 3;
    if (/скоріше\s*добре|rather good/.test(label)) return 4;
    if (/добре|good/.test(label)) return 5;
    if (/дуже\s*добре|great|excellent/.test(label)) return 6;

    return 3;
}

// ------------------------------
// 🔧 Check media
// ------------------------------
export function hasMedia(entry) {
    return Array.isArray(entry?.images) && entry.images.length > 0;
}

// ------------------------------
// 🔧 ⭐ MAIN SORT FUNCTION ⭐
// ------------------------------
export function sortEntries(entries = [], sortBy = "date-new") {
    const arr = [...entries];
    const collator = new Intl.Collator("uk", { sensitivity: "base" });

    switch (sortBy) {

        // 📅 Нові → старі
        case "date-new":
            arr.sort((a, b) => extractDate(b) - extractDate(a));
            break;

        // 📅 Старі → нові
        case "date-old":
            arr.sort((a, b) => extractDate(a) - extractDate(b));
            break;

        // 🔤 A → Z
        case "title-az":
            arr.sort((a, b) => collator.compare(a?.title || "", b?.title || ""));
            break;

        // 🔤 Z → A
        case "title-za":
            arr.sort((a, b) => collator.compare(b?.title || "", a?.title || ""));
            break;

        // 🙂➡️😡 Позитивні зверху
        case "mood-pos":
            arr.sort((a, b) => moodScore(b) - moodScore(a));
            break;

        // 😡➡️🙂 Негативні зверху
        case "mood-neg":
            arr.sort((a, b) => moodScore(a) - moodScore(b));
            break;

        // 🖼️ Є медіа зверху
        case "media-first":
            arr.sort((a, b) => Number(hasMedia(b)) - Number(hasMedia(a)));
            break;

        // 🖼️ Медіа знизу
        case "media-last":
            arr.sort((a, b) => Number(hasMedia(a)) - Number(hasMedia(b)));
            break;

        // ⭐ 📌 Bookmark зверху
        case "bookmark-first":
            arr.sort((a, b) => {
                const A = a?.bookmarked ? 1 : 0;
                const B = b?.bookmarked ? 1 : 0;
                return B - A; // bookmarks first
            });
            break;

        // 🔄 Дефолт
        default:
            arr.sort((a, b) => extractDate(b) - extractDate(a));
    }

    return arr;
}
