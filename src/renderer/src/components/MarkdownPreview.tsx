import React, { useMemo } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkBreaks from 'remark-breaks'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'

export function MarkdownPreview({ content }: { content: string }): React.JSX.Element {
	const markdownContent = useMemo(() => content, [content])
	const [markdown, setMarkdown] = React.useState<string>('')
	const markdownProcess = async (markdownContent: string): Promise<string> => {
		const file = await unified()
			.use(remarkParse)
			.use(remarkBreaks)
			.use(remarkRehype)
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
			className="w-full h-full p-4 border border-gray-300 rounded-md overflow-auto prose"
			dangerouslySetInnerHTML={{ __html: markdown }}
		/>
	)
}
