// useEntryActions.js
import { useState } from "react";

export default function useEntryActions({ entries, setEntries, onEdit, onDelete }) {
    const [bookmarked, setBookmarked] = useState({});
    const [hiddenIds, setHiddenIds] = useState(new Set());

    const editEntry = (e) => onEdit?.(e);

    const bookmarkEntry = (e) =>
        setBookmarked((prev) => ({ ...prev, [e.id]: !prev[e.id] }));

    const deleteEntry = (e) => {
        setEntries?.((prev) => prev.filter((x) => x.id !== e.id));
        onDelete?.(e);
        setHiddenIds((prev) => new Set([...prev, e.id]));
    };

    const printEntry = (entry) => {
        const html = buildPrintableHtml(entry);

        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        iframe.setAttribute("sandbox", "allow-modals allow-same-origin allow-scripts");

        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        const cleanup = () => {
            try {
                if (iframe && iframe.parentNode) iframe.parentNode.removeChild(iframe);
            } catch (_) {}
        };

        const printWhenReady = () => {
            const imgs = Array.from(doc.images || []);
            const go = () => {
                try {
                    const w = iframe.contentWindow;
                    if (!w) return cleanup();
                    w.focus?.();
                    w.print?.();
                } finally {
                    setTimeout(cleanup, 400);
                }
            };

            if (imgs.length === 0) return go();

            let left = imgs.length;
            const done = () => --left <= 0 && go();

            imgs.forEach((img) => {
                if (img.complete) return done();
                img.addEventListener("load", done);
                img.addEventListener("error", done);
            });

            setTimeout(go, 1500);
        };

        if (doc.readyState === "complete") {
            setTimeout(printWhenReady, 50);
        } else {
            iframe.onload = () => setTimeout(printWhenReady, 50);
        }
    };

    return {
        editEntry,
        bookmarkEntry,
        deleteEntry,
        printEntry,
        bookmarked,
        hiddenIds,
    };
}

/* ================= helpers ================= */

function escapeHtml(s) {
    const str = String(s ?? "");
    return str.replace(/[&<>"']/g, (c) => {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
}

function chipToText(x) {
    if (x == null) return "";
    if (typeof x === "string") return x;
    return x.text || x.label || x.title || x.name || String(x);
}

function extractChipsFromHtml(html = "") {
    const chips = [];
    const re = /<span[^>]*data-chip[^>]*>(.*?)<\/span>/gim;
    let m;
    while ((m = re.exec(html)) !== null) {
        const txt = m[1].replace(/<\/?[^>]+>/g, "").trim();
        if (txt) chips.push(txt);
    }
    return chips;
}

function uniqNorm(arr) {
    const seen = new Set();
    const out = [];
    for (const s of arr) {
        const key = String(s).toLowerCase().replace(/\s+/g, " ").trim();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        out.push(s);
    }
    return out;
}

function toLinearFromAny(grad) {
    if (!grad) return null;
    const stops = grad.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/g);
    if (!stops || stops.length === 0) return null;
    const first = stops[0];
    const last = stops[stops.length - 1];
    return `linear-gradient(180deg, ${first} 0%, ${last} 100%)`;
}

function hasMood(meta) {
    if (!meta) return false;
    return Boolean(
        meta.moodLabel ||
        meta.label ||
        (Array.isArray(meta.tags) && meta.tags.length) ||
        (Array.isArray(meta.reasons) && meta.reasons.length) ||
        meta.emoji ||
        meta.moodEmoji
    );
}

function moodGradient(meta) {
    if (meta?.colors?.center && meta?.colors?.edge) {
        return `linear-gradient(180deg, ${meta.colors.center} 0%, ${meta.colors.edge} 100%)`;
    }
    const any = toLinearFromAny(meta?.gradient);
    if (any) return any;
    return "linear-gradient(180deg, rgba(212,231,250,0.95) 0%, rgba(177,211,245,0.90) 100%)";
}

function buildPrintableHtml(entry) {
    const dt = new Date(entry.dateISO ?? Date.now());
    const dateStr = dt.toLocaleDateString("uk-UA", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    const timeStr = dt.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const meta = entry.moodMeta || {};
    const emoji = meta.moodEmoji || meta.emoji || "✨";
    const label = meta.moodLabel || meta.label || "";
    const headerBg = moodGradient(meta);

    const rawHtml =
        entry.editorHtml ||
        entry.html ||
        (entry.plainText
            ? `<p>${escapeHtml(entry.plainText).replace(/\n/g, "<br/>")}</p>`
            : entry.plain
                ? `<p>${escapeHtml(entry.plain).replace(/\n/g, "<br/>")}</p>`
                : "");

    const embeddedImgs = Array.from(
        (rawHtml || "").matchAll(/<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/gi)
    )
        .map((m) => m[1])
        .filter(Boolean);

    const normalizeSrc = (x) => {
        if (!x) return "";
        if (typeof x === "string") return x;
        return x.src || x.url || x.dataURL || x.blobUrl || "";
    };
    const extraImgs = Array.isArray(entry.images)
        ? entry.images.map(normalizeSrc)
        : [];
    const allImgs = Array.from(new Set([...embeddedImgs, ...extraImgs])).filter(
        Boolean
    );

    const title = escapeHtml(entry.title || "Запис");

    const tags = Array.isArray(meta.tags) ? meta.tags : [];
    const reasons = Array.isArray(meta.reasons) ? meta.reasons : [];

    const chipsFromField = Array.isArray(entry.questionsChips)
        ? entry.questionsChips.map(chipToText).filter(Boolean)
        : [];
    const chipsFromHtml = chipsFromField.length
        ? []
        : extractChipsFromHtml(rawHtml);
    const chips = uniqNorm([...chipsFromField, ...chipsFromHtml]);

    const pills = (arr) =>
        arr.map((t) => `<span class="pill">${escapeHtml(String(t))}</span>`).join("");

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { size: A4; margin: 14mm; }
  html, body { background: #fff; color: #111; }
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif; line-height: 1.6; margin: 0; }
  .container { max-width: 900px; margin: 0 auto; padding: 8px 0; }

  h1 { font-size: 22px; margin: 0 0 12px; }

  .mood {
    border-radius: 16px; padding: 16px; margin: 0 0 16px 0;
    background-image: ${headerBg};
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .mood .emoji { font-size: 40px; line-height: 1; }
  .mood .label { font-weight: 700; margin-top: 6px; }
  .meta { font-size: 12px; color: #444; margin-top: 6px; }

  .pill-row { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
  .pill {
    display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px;
    background: #eef2f7; color: #223;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  .content { margin-top: 16px; }
  .content img { max-width: 100%; height: auto; break-inside: avoid; }

  .images { margin-top: 12px; display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 8px; }
  .images img { width: 100%; height: auto; border-radius: 8px; break-inside: avoid; }

  .section { margin-top: 16px; }
  .section h3 { margin: 0 0 8px; font-size: 14px; color: #333; }

  .footer { margin-top: 24px; font-size: 12px; color: #444; }
</style>
</head>
<body>
  <div class="container">
    ${entry.title ? `<h1>${title}</h1>` : ``}

    ${hasMood(meta) ? `
      <div class="mood">
        <div class="emoji">${emoji}</div>
        ${label ? `<div class="label">${escapeHtml(label)}</div>` : ``}
        <div class="meta">Емоція • ${dateStr} • ${timeStr}</div>
        ${tags.length ? `<div class="pill-row">${pills(tags)}</div>` : ``}
        ${reasons.length ? `<div class="pill-row">${pills(reasons)}</div>` : ``}
      </div>
    ` : ``}

    ${chips.length ? `
      <div class="section">
        <h3>Запитання / думки</h3>
        <div class="pill-row">${pills(chips)}</div>
      </div>
    ` : ``}

    ${rawHtml ? `<div class="content">${rawHtml}</div>` : ``}

    ${allImgs.length ? `
      <div class="images">
        ${allImgs.map((src) => `<img src="${escapeHtml(src)}" alt="" />`).join("")}
      </div>
    ` : ``}

    <div class="footer">${dateStr} • ${timeStr}</div>
  </div>
</body>
</html>`;
}
