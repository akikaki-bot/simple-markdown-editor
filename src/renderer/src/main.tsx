import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import { AppSidebar } from '@renderer/components/sidebar'
import { SidebarProvider } from '@renderer/components/ui/sidebar'
import { Modals as ModalProvider } from '@renderer/modal'
import { DocumentTitle } from '@renderer/components/documentTitle'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<SidebarProvider>
			<AppSidebar />
			<main className="flex flex-col h-screen w-full">
				<DocumentTitle />
				<ModalProvider />
				<App />
			</main>
		</SidebarProvider>
	</StrictMode>
)
