import { MarkdownInput } from './components/MarkdownInput'
import { MarkdownPreview } from './components/MarkdownPreview'
import { markdownAtom, tmpMarkdownAtom } from "./atoms/markdownAtoms"
import { selectedIdAtom } from "./atoms/selectedIdAtom"

import { useAtom, useAtomValue } from "jotai"
import React from 'react'

export default function App(): React.JSX.Element {

	const content = useAtomValue(markdownAtom);
	const selectedId = useAtomValue(selectedIdAtom);

	const [tmpContent, setTmpContent] = useAtom(tmpMarkdownAtom);

	const getDocumentContent = (id: string) => {
		const item = content.find((item) => item.id === id);
		return item ? item.content : "";
	}

	React.useEffect(() => {
		setTmpContent(getDocumentContent(selectedId));
	}, [selectedId])


	return (
		<div className="flex flex-col sm:flex-row  justify-center h-screen gap-4 px-2 py-4">
			<div className="flex flex-col w-full">
				<MarkdownInput
					onChange={(value) => setTmpContent(value)}
					defaultValue={tmpContent}
					value={tmpContent}
				/>
			</div>
			<MarkdownPreview content={tmpContent} />
		</div >
	)
}
