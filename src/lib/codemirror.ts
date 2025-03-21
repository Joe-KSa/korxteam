import { EditorView } from "@codemirror/view";
import { dracula } from "@uiw/codemirror-theme-dracula";

export const transparent = EditorView.theme({
  "&": {
    backgroundColor: "#1b1b1b !important",
  },
});

export const extensions = [
  dracula,
  transparent,
  EditorView.lineWrapping,
];
