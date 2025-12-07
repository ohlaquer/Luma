// ClearOnFullSelection.js (або в твоєму існуючому екстеншені)
import { Extension } from "@tiptap/core";

export default Extension.create({
    name: "hardClear",
    addKeyboardShortcuts() {
        const wipe = () => {
            this.editor.chain().focus().clearContent(true).setParagraph().run();
            return true;
        };
        return {
            "Mod-Backspace": wipe, // Ctrl+Backspace
            "Mod-Delete": wipe,    // Ctrl+Delete
        };
    },
});
