import { useAtom, useAtomValue } from "jotai";

import { modalShownAtom } from "@renderer/atoms/modalShownAtom";
import { markdownAtom } from "@renderer/atoms/markdownAtoms";
import { targetIdAtom } from "@renderer/atoms/selectedIdAtom";

import { Button } from "@renderer/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@renderer/components/ui/dialog"

export function DeleteModal(): React.JSX.Element {

	const selectedId = useAtomValue(targetIdAtom);
	const [modalId, setModalShown] = useAtom(modalShownAtom);

	const [content, setContent] = useAtom(markdownAtom);

	const deleteDocument = () => {
		const updatedContent = content.filter((item) => item.id !== selectedId);
		setContent(updatedContent);
		setModalShown(null);
	};

	return (
		<Dialog open={modalId === "delete"} onOpenChange={(open) => { if (!open) setModalShown(null); }}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Document</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete the document "{selectedId}"? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" onClick={() => setModalShown(null)}>Cancel</Button>
					</DialogClose>
					<Button variant="destructive" onClick={deleteDocument}>Delete</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
