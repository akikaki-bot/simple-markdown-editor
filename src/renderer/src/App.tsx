import { MarkdownInput } from './components/MarkdownInput'
import { MarkdownPreview } from './components/MarkdownPreview'

import React, { useState } from 'react'

export default function App(): React.JSX.Element {
	const [content, setContent] = useState<string>(
		'# Hello World\nThis is a sample markdown content.'
	)

	const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = (event) => {
				const text = event.target?.result
				if (typeof text === 'string') {
					setContent(text)
				}
			}
			reader.readAsText(file, 'UTF-8')
		}
	}

	const handleExportFile = (): void => {
		const element = document.createElement('a')
		const file = new Blob([content], { type: 'text/markdown' })
		element.href = URL.createObjectURL(file)
		element.download = 'exported_markdown.md'
		document.body.appendChild(element)
		element.click()

		document.removeChild(element)
	}

	return (
		<div className="flex flex-col sm:flex-row  justify-center h-screen gap-4 px-2 py-4">
			<div className="flex flex-col w-full">
				<div className="flex flex-row items-center mb-2">
					<input
						type="file"
						id="importFile"
						accept=".md,.markdown,.txt,.mdx"
						onChange={handleImportFile}
						aria-hidden
						hidden
					/>
					<button
						className="text-black px-3 py-1.5 rounded-md border border-blue-500 hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 transition-colors"
						onClick={() => document.getElementById('importFile')?.click()}
					>
						Import Markdown
					</button>
					<button
						className="text-black px-3 py-1.5 rounded-md border border-green-500 hover:border-green-600 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 ml-2 transition-colors"
						onClick={handleExportFile}
					>
						Export as Markdown
					</button>
				</div>
				<MarkdownInput
					onChange={(value) => setContent(value)}
					defaultValue={content}
					value={content}
				/>
			</div>
			<MarkdownPreview content={content} />
		</div>
	)
}
