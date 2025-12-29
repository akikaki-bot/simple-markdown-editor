import { useAtom, useAtomValue } from 'jotai'
import React from 'react'

import { targetIdAtom } from '@renderer/atoms/selectedIdAtom'
import { modalShownAtom } from '@renderer/atoms/modalShownAtom'
import { markdownAtom } from '@renderer/atoms/markdownAtoms'

import { Button } from '@renderer/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@renderer/components/ui/dialog'
import { Input } from '@renderer/components/ui/input'

export function RenameModal(): React.JSX.Element {
	const targetDocId = useAtomValue(targetIdAtom)

	const [content, setContent] = useAtom(markdownAtom)
	const [modalId, setModalShown] = useAtom(modalShownAtom)

	const [newId, setNewId] = React.useState<string>(targetDocId || '')

	const renameDocument = (): void => {
		if (targetDocId === newId) {
			setModalShown(null)
			return
		}

		if (!newId || newId === targetDocId || content.find((item) => item.id === newId)) {
			alert('Invalid or duplicate document ID!')
			return
		}

		const updatedContent = content.map((item) =>
			item.id === targetDocId ? { ...item, id: newId } : item
		)
		setContent(updatedContent)
		setModalShown(null)
	}

	React.useEffect(() => {
		setNewId(targetDocId || '')
	}, [targetDocId])

	return (
		<Dialog
			open={modalId === 'rename'}
			onOpenChange={(open) => {
				if (!open) setModalShown(null)
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rename Document</DialogTitle>
					<DialogDescription>
						<label htmlFor="new-id" className="block mb-2">
							New Document ID:
						</label>
						<Input
							id="new-id"
							type="text"
							value={newId}
							onChange={(e) => setNewId(e.target.value)}
							className="w-full"
						/>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" onClick={() => setModalShown(null)}>
							Cancel
						</Button>
					</DialogClose>
					<Button onClick={() => renameDocument()}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
