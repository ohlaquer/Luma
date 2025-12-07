// pluralize.js
export function pluralize(count, [one, few, many]) {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return one;   // 1 запис
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few; // 2-4 записи
    return many; // 5+ записів
}
