import { MarkdownInput } from './components/MarkdownInput'
import { MarkdownPreview } from './components/MarkdownPreview'
import { markdownAtom, tmpMarkdownAtom, MarkdownState } from './atoms/markdownAtoms'
import { selectedIdAtom } from './atoms/selectedIdAtom'

import { useAtom, useAtomValue } from 'jotai'
import React from 'react'

export default function App(): React.JSX.Element {
	const [content, setGlobalContent] = useAtom(markdownAtom)
	const selectedId = useAtomValue(selectedIdAtom)

	const [tmpContent, setTmpContent] = useAtom(tmpMarkdownAtom)

	const getDocumentContent = (id: string): string => {
		const item = content.find((item) => item.id === id)
		return item ? item.content : ''
	}

	React.useEffect(() => {
		setTmpContent(getDocumentContent(selectedId))
	}, [selectedId])

	React.useEffect(() => {
		window.electronAPI.onLoadSmedData((data: MarkdownState[]) => {
			setGlobalContent(data)
		})
	}, [])

	return (
		<div className="flex flex-row justify-center gap-4 h-[91%] max-h-svh px-2">
			<div className="flex flex-col w-full">
				<MarkdownInput
					onChange={(value) => setTmpContent(value)}
					//defaultValue={tmpContent}
					value={tmpContent}
				/>
			</div>
			<MarkdownPreview content={tmpContent} />
		</div>
	)
}
