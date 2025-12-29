import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import { AppSidebar } from "@renderer/components/sidebar"
import { SidebarProvider, SidebarTrigger } from "@renderer/components/ui/sidebar"
import { Modals as ModalProvider } from "@renderer/modal"

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<SidebarProvider>
			<AppSidebar />
			<main className="flex flex-col w-full h-screen">
				<SidebarTrigger />
				<ModalProvider />
				<App />
			</main>
		</SidebarProvider>
	</StrictMode>
)
