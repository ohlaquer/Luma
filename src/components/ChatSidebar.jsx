import { useEffect, useState, useRef } from "react";
import { Pencil, Search, MoreVertical, Trash2, Edit3 } from "lucide-react";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import ConfirmDeleteChat from "./ConfirmDeleteChat";
import { createPortal } from "react-dom";

export default function ChatSidebar({ onSelectChat, currentChatId, onDeleteChat, onNewChat, mobile = false }) {
    const [search, setSearch] = useState("");
    const [chats, setChats] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newName, setNewName] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [menuCoords, setMenuCoords] = useState({ x: 0, y: 0 });
    const menuRef = useRef(null);


    useEffect(() => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, "users", auth.currentUser.uid, "chats"),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            setChats(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsub();
    }, [auth.currentUser]);

    const handleNewChat = async () => {
        if (!auth.currentUser) return;

        const today = new Date();
        const title = today.toLocaleDateString("uk-UA");

        const docRef = await addDoc(
            collection(db, "users", auth.currentUser.uid, "chats"),
            {
                name: title,
                createdAt: serverTimestamp(),
            }
        );

        onSelectChat(docRef.id);

        // 👇 одразу скидаємо стан у ChatPage
        if (typeof onNewChat === "function") onNewChat();
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(null);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    useEffect(() => {
        const closeOnScroll = () => setMenuOpen(null);
        if (menuOpen) {
            document.addEventListener("scroll", closeOnScroll, true);
        }
        return () => document.removeEventListener("scroll", closeOnScroll, true);
    }, [menuOpen]);

    const handleDelete = async (chatId) => {
        if (!auth.currentUser) return;
        await deleteDoc(doc(db, "users", auth.currentUser.uid, "chats", chatId));

        if (chatId === currentChatId) {
            onSelectChat(null);
            if (onDeleteChat) onDeleteChat(); // 👈 викликаємо ресет
        }
    };


    const handleRename = async (chatId) => {
        if (!auth.currentUser || !newName.trim()) return;
        await updateDoc(
            doc(db, "users", auth.currentUser.uid, "chats", chatId),
            { name: newName.trim() }
        );
        setEditingId(null);
        setNewName("");
    };

    const filtered = chats.filter((chat) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();

        const nameMatch = chat.name?.toLowerCase().includes(q);

        // Якщо є createdAt (timestamp з Firestore) → шукаємо по даті
        const dateMatch =
            chat.createdAt &&
            new Date(chat.createdAt.toDate())
                .toLocaleDateString("uk-UA")
                .toLowerCase()
                .includes(q);

        return nameMatch || dateMatch;
    });


    return (
        <div className="flex flex-col h-full gap-3 p-3">
            {/* Кнопка "Новий чат" */}
            <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm
  bg-[var(--neutral-bg)] text-[var(--text)]
  hover:bg-[var(--highlight-bg)] hover:text-[var(--highlight-text)]
  transition-colors shadow-sm mb-2"
            >
                <Pencil className="w-4 h-4" />
                Новий чат
            </button>

            {/* Поле пошуку */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Шукати в чатах"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 pr-9 rounded-xl text-sm outline-none
    bg-[var(--neutral-bg)] text-[var(--text)]
    placeholder:text-[var(--muted-text)] shadow-sm"
                />
                <Search
                    className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]"
                />
            </div>


            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {filtered.length === 0 ? (
                    <p className="text-xs text-center mt-10 text-[var(--muted-text)]">
                        Нічого не знайдено
                    </p>
                ) : (
                    <ul className="space-y-1 text-sm">
                        {filtered.map((chat) => (
                            <li
                                key={chat.id}
                                className={`relative flex items-center justify-between px-4 py-2 rounded-md cursor-pointer transition-colors ${
                                    chat.id === currentChatId
                                        ? "bg-[var(--highlight-bg)] font-medium"
                                        : menuOpen === chat.id
                                            ? "" // 👈 якщо відкрите меню — не підсвічуємо
                                            : "hover:bg-[var(--neutral-bg)]"
                                }`}
                            >

                            {editingId === chat.id ? (
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onBlur={() => handleRename(chat.id)}
                                        onKeyDown={(e) => e.key === "Enter" && handleRename(chat.id)}
                                        className="flex-1 text-sm px-2 py-1 rounded bg-[var(--neutral-bg)]"
                                        autoFocus
                                    />
                                ) : (
                                    <span
                                        className="truncate flex-1"
                                        onClick={() => onSelectChat(chat.id)}
                                    >
                                         {chat.name}
                                    </span>
                                    )}

                                <button
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const scrollY = window.scrollY;
                                        const scrollX = window.scrollX;

                                        setMenuCoords({
                                            x: rect.right - 150 + scrollX,
                                            y: rect.bottom + 4 + scrollY,
                                        });

                                        setMenuOpen(menuOpen === chat.id ? null : chat.id);
                                    }}


                                    className="p-1 rounded-md"
                                >
                                    <MoreVertical className="w-4 h-4 text-[var(--muted-text)]" />
                                </button>

                                {menuOpen === chat.id &&
                                    createPortal(
                                        <div
                                            ref={menuRef}
                                            className="fixed z-[9999] bg-[var(--card-bg)] border border-[var(--highlight-border)] rounded-md shadow-lg"
                                            style={{
                                                top: `${menuCoords.y}px`,
                                                left: `${menuCoords.x}px`,
                                                width: "150px",
                                            }}
                                        >
                                            <button
                                                onClick={() => {
                                                    setEditingId(chat.id);
                                                    setNewName(chat.name);
                                                    setMenuOpen(null);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--neutral-bg)] w-full"
                                            >
                                                <Edit3 size={14} /> Редагувати
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onDeleteChat(chat.id);
                                                    setMenuOpen(null);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-[#E56A6A] hover:bg-[var(--neutral-bg)] hover:text-[#D95C5C] w-full transition-colors duration-200"

                                            >
                                                <Trash2 size={14} /> Видалити
                                            </button>

                                        </div>,
                                        document.getElementById("menu-root")
                                    )}


                            </li>

                        ))}
                    </ul>
                )}
            </div>
        </div>

    );
}
