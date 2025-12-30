import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
	interface Window {
		electron: ElectronAPI
		electronAPI: {
			onLoadSmedData: (callback: (data: MarkdownState[]) => void) => void
		}
	}
}
