import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export interface MarkdownState {
	content: string
	id: string
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('electron', electronAPI)
		contextBridge.exposeInMainWorld('electronAPI', {
			onLoadSmedData: (callback: (data: MarkdownState[]) => void) => {
				electronAPI.ipcRenderer.on('load-smed-data', (_event, data) => {
					callback(data)
				})
			}
		})
	} catch (error) {
		console.error(error)
	}
} else {
	// @ts-ignore (define in dts)
	window.electron = electronAPI
	// @ts-ignore (define in dts)
	window.api = api
}
