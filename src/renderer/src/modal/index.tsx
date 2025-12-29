import { DeleteModal } from './deleteModal'
import { RenameModal } from './renameModal'
import React from 'react'

export function Modals(): React.JSX.Element {
	return (
		<>
			<DeleteModal />
			<RenameModal />
		</>
	)
}
