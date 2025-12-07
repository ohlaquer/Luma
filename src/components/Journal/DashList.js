import BulletList from "@tiptap/extension-bullet-list";
import { mergeAttributes } from "@tiptap/core";

const DashList = BulletList.extend({
    name: "dashList",
    group: "block",
    content: "listItem+",
    parseHTML() {
        return [{ tag: 'ul[data-variant="dash"]' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ["ul", mergeAttributes(HTMLAttributes, { "data-variant": "dash" }), 0];
    },
});

export default DashList;
