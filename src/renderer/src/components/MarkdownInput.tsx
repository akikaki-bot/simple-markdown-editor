import React from 'react'

import { useAtom, useAtomValue } from 'jotai'
import { markdownAtom, tmpMarkdownAtom } from '@renderer/atoms/markdownAtoms'
import { selectedIdAtom } from '@renderer/atoms/selectedIdAtom'

export function MarkdownInput({
	onChange,
	defaultValue,
	value
}: {
	value?: string
	onChange: (value: string) => void
	defaultValue?: string
}): React.JSX.Element {
	const selectedId = useAtomValue(selectedIdAtom)
	const tmpContent = useAtomValue(tmpMarkdownAtom)
	const [content, setContent] = useAtom(markdownAtom)

	const saveContent = (): void => {
		const updatedContent = content.map((item) =>
			item.id === selectedId ? { ...item, content: tmpContent } : item
		)
		setContent(updatedContent)
	}

	const saveGlobalStore = (): void => {
		window.electron.ipcRenderer.send('savesmed', JSON.stringify(content))
	}

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
		onChange(event.target.value)
	}

	const handleOnTargetChange = (): void => {
		saveContent()
		saveGlobalStore()
	}

	const inputValue = React.useMemo(() => {
		return value
	}, [value])

	return (
		<textarea
			value={inputValue}
			defaultValue={defaultValue}
			className="w-full h-full max-h-full p-4 border border-gray-300 rounded-md focus:outline-none resize-none"
			placeholder="Enter your markdown here..."
			onChange={handleChange}
			onBlur={handleOnTargetChange}
		/>
	)
}
