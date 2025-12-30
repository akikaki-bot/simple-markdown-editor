import { SidebarTrigger } from '@renderer/components/ui/sidebar'

import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@renderer/components/ui/breadcrumb'

import { selectedIdAtom } from '@renderer/atoms/selectedIdAtom'

import { previewToggleAtom } from '@renderer/atoms/previewToggleAtom'

import { Eye, EyeOff } from 'lucide-react'

import React from 'react'
import { useAtomValue, useAtom } from 'jotai'

export function DocumentTitle(): React.JSX.Element {
	const selectedId = useAtomValue(selectedIdAtom)
	const [isHidden, setIsHidden] = useAtom(previewToggleAtom)

	const togglePreview = (): void => {
		setIsHidden(!isHidden)
	}

	return (
		<div className="flex flex-row gap-4 p-2 justify-between items-center ">
			<div className="flex flex-row gap-4 items-center">
				<SidebarTrigger />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbPage>Documents</BreadcrumbPage>
						</BreadcrumbItem>
						<BreadcrumbSeparator>/</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbPage>{selectedId}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<button className="p-2 border rounded-md transition" onClick={togglePreview}>
				{isHidden ? <Eye /> : <EyeOff />}
			</button>
		</div>
	)
}
