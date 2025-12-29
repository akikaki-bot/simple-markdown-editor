import { atom } from "jotai";

export interface MarkdownState {
	content: string;
	id: string;
}

export const markdownAtom = atom<MarkdownState[]>([
	{
		id: "default",
		content: "# Welcome to the Markdown Editor\n\nThis is a simple markdown editor built with React and Jotai.\n\n- Type your markdown in the left pane.\n- See the rendered HTML in the right pane.\n\nEnjoy!"
	}
]);

export const tmpMarkdownAtom = atom<string>("");
