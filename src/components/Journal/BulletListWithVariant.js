import BulletList from "@tiptap/extension-bullet-list";
import { mergeAttributes } from "@tiptap/core";

const BulletListWithVariant = BulletList.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            variant: {
                default: "disc", // "disc" або "dash"
                parseHTML: el => el.getAttribute("data-variant") || "disc",
                renderHTML: attrs => ({
                    "data-variant": attrs.variant || "disc",
                }),
            },
        };
    },
    renderHTML({ HTMLAttributes }) {
        return ["ul", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },
});

export default BulletListWithVariant;
