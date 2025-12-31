import React, { useMemo } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkBreaks from 'remark-breaks'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import rehypePrettyCode from 'rehype-pretty-code'

import { previewToggleAtom } from '@renderer/atoms/previewToggleAtom'
import { useAtomValue } from 'jotai'

export function MarkdownPreview({ content }: { content: string }): React.JSX.Element {
	const isHidden = useAtomValue(previewToggleAtom)
	const markdownContent = useMemo(() => content, [content])
	const [markdown, setMarkdown] = React.useState<string>('')
	const markdownProcess = async (markdownContent: string): Promise<string> => {
		const file = await unified()
			.use(remarkParse)
			.use(remarkBreaks)
			.use(remarkRehype)
			.use(rehypePrettyCode, {
				theme: 'one-dark-pro'
			})
			.use(rehypeStringify)
			.process(markdownContent)

		return file.toString()
	}

	React.useEffect(() => {
		markdownProcess(markdownContent).then((result) => {
			setMarkdown(result)
		})
	}, [markdownContent])

	return (
		<div
			className="w-full p-4 border max-h-full h-full border-gray-300 rounded-md overflow-auto prose transition-transform transform-gpu"
			dangerouslySetInnerHTML={{ __html: markdown }}
			style={{
				scale: isHidden ? 0 : 1,
				transformOrigin: 'right',
				transition: 'scale 0.3s ease',
				display: isHidden ? 'none' : 'block'
			}}
		/>
	)
}
