import React from 'react'

export function MarkdownInput({
	onChange,
	defaultValue,
	value
}: {
	value?: string
	onChange: (value: string) => void
	defaultValue?: string
}): React.JSX.Element {
	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
		onChange(event.target.value)
	}

	const inputValue = React.useMemo(() => {
		return value
	}, [value])

	return (
		<textarea
			value={inputValue}
			defaultValue={defaultValue}
			className="w-full h-full p-4 border border-gray-300 rounded-md focus:outline-none"
			placeholder="Enter your markdown here..."
			onChange={handleChange}
		/>
	)
}
