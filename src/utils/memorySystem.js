import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit, where, addDoc, serverTimestamp } from "firebase/firestore";
import { encrypt, decrypt } from "./secure";
import { updateDoc } from "firebase/firestore";

// 🧠 Аналізує повідомлення
export async function analyzeMessageForMemory(message) {
    const prompt = `
  Analyze this message for memory importance.
  Return JSON with fields:
  { summary, importance (0-1), emotion, isMemoryWorthy }.

  Message: """${message}"""
  `;

    // тут викликаєш свою API / OpenAI endpoint
    const res = await fetch("/api/memory-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    return data;
}

// 💾 Зберігає важливі спогади
export async function saveMemory(uid, memoryData) {
    if (!uid || !memoryData) return;

    const memRef = collection(db, `users/${uid}/memory`);
    const snapshot = await getDocs(memRef);

    // 🔍 перевіряємо, чи схожий спогад уже є
    const similar = snapshot.docs.find((doc) => {
        const data = JSON.parse(decrypt(doc.data().data));
        return (
            data.summary &&
            memoryData.summary &&
            data.summary.toLowerCase().includes(memoryData.summary.toLowerCase().slice(0, 15))
        );
    });

    const encrypted = encrypt(JSON.stringify(memoryData));

    if (similar) {
        // ♻️ оновлюємо існуючий спогад (нові дані, важливість, час)
        await updateDoc(similar.ref, {
            data: encrypted,
            importance: memoryData.importance || 0.7,
            updatedAt: serverTimestamp(),
        });
        console.log("♻️ Memory updated:", memoryData.summary);
    } else {
        // 💾 додаємо новий
        await addDoc(memRef, {
            data: encrypted,
            importance: memoryData.importance || 0,
            createdAt: serverTimestamp(),
        });
        console.log("💾 New memory saved:", memoryData.summary);
    }

    // 🧹 обмеження до 20 найновіших важливих спогадів
    const all = snapshot.docs.sort(
        (a, b) => (b.data().createdAt?.seconds || 0) - (a.data().createdAt?.seconds || 0)
    );
    if (all.length > 20) {
        const toDelete = all.slice(20);
        for (const d of toDelete) {
            await deleteDoc(d.ref);
        }
        console.log(`🧹 Cleared ${toDelete.length} old memories`);
    }
}



// 📖 Витягує останні 5 пам’ятних записів
export async function recallMemory(uid) {
    const q = query(
        collection(db, `users/${uid}/memory`),
        where("importance", ">", 0.6), // 👈 фільтруємо неважливі спогади
        orderBy("importance", "desc"),
        orderBy("createdAt", "desc"),
        limit(5)
    );

    const snapshot = await getDocs(q);

    const memories = snapshot.docs.map((doc) => {
        const encryptedData = doc.data().data;
        try {
            const decrypted = decrypt(encryptedData);
            return JSON.parse(decrypted);
        } catch (err) {
            console.error("❌ Decrypt memory failed:", err);
            return { summary: "[Помилка розшифрування]", emotion: "unknown" };
        }
    });

    console.log(`🧠 Retrieved ${memories.length} важливих спогадів`);
    return memories;
}

export async function reflectMemories(uid) {
    console.log("🌙 reflectMemories викликана для користувача:", uid);
    if (!uid) return;

    // 🔹 1. Вибираємо пам’ять із Firestore
    const q = query(
        collection(db, `users/${uid}/memory`),
        where("importance", ">", 0.6),
        orderBy("createdAt", "desc"),
        limit(20)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        console.log("🤔 Немає пам’яті для рефлексії");
        return;
    }

    // 🔹 2. Розшифровуємо спогади
    const memories = snapshot.docs.map((doc) => {
        try {
            const decrypted = decrypt(doc.data().data);
            return JSON.parse(decrypted);
        } catch (err) {
            console.error("❌ Decrypt failed for memory:", doc.id, err);
            return null;
        }
    }).filter(Boolean);

    console.log(`🧠 Retrieved ${memories.length} важливих спогадів для рефлексії`);

    // 🔹 3. Відправляємо масив спогадів на сервер
    const res = await fetch("/api/memory-reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: uid,
            memories, // ✅ надсилаємо саме масив спогадів
        }),
    });

    const data = await res.json();
    if (!data || !data.reflection) {
        console.warn("⚠️ Reflection failed:", data);
        return;
    }

    const reflectionText = data.reflection;
    console.log("🪞 Reflection result:", reflectionText);

    // 🔹 4. Зберігаємо як новий спогад типу "reflection"
    const meta = {
        summary: reflectionText,
        emotion: "збалансований",
        importance: 0.9,
        type: "reflection",
    };

    await addDoc(collection(db, `users/${uid}/memory`), {
        data: encrypt(JSON.stringify(meta)),
        importance: meta.importance,
        createdAt: serverTimestamp(),
    });

    console.log("💾 Reflection saved:", meta.summary);
}
