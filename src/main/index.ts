import { app, shell, BrowserWindow, ipcMain } from 'electron'
import fs from 'fs'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

interface MarkdownState {
	content: string
	id: string
}

function getSmedData(): MarkdownState[] {
	const saveFilePath = app.getPath('appData') + '/simple-markdown-editor-data/data.dsmed'
	try {
		if (fs.existsSync(saveFilePath)) {
			const data = fs.readFileSync(saveFilePath, 'utf-8')
			return JSON.parse(data) as MarkdownState[]
		} else {
			return [
				{
					id: 'helloworld',
					content:
						'# Welcome to the Markdown Editor\n\nThis is a simple markdown editor built with React and Jotai.\n\n- Type your markdown in the left pane.\n- See the rendered HTML in the right pane.\n\nEnjoy!'
				}
			]
		}
	} catch (err) {
		console.error('Error reading .smed file:', err)
		fs.copyFileSync(saveFilePath, saveFilePath + `.backup-${Date.now()}.dsmed`)
		console.log('[Log] Corrupted data backed up.')
		return [
			{
				id: 'error',
				content: `# Error\n\nThere was an error loading your saved data. \n\n ## Reason \n\n \`\`\`\n\n ${err}\n\n\`\`\`\n\n ## Tips: \n\n A backup of the corrupted data has been created. You can try re-importing it manually.`
			}
		]
	}
}

function createWindow(): void {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 670,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false
		}
	})

	mainWindow.on('ready-to-show', () => {
		mainWindow.webContents.send('load-smed-data', getSmedData())
		mainWindow.show()
	})

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url)
		return { action: 'deny' }
	})

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron')

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	// IPC test
	ipcMain.on('ping', () => console.log('pong'))

	ipcMain.on('savesmed', (_event, data: string) => {
		const saveFilePath = app.getPath('appData') + '/simple-markdown-editor-data'
		if (!fs.existsSync(saveFilePath)) {
			fs.mkdirSync(saveFilePath, { recursive: true })
		}
		fs.writeFileSync(saveFilePath + '/data.dsmed', data, 'utf-8')
		console.log('[Log] Data saved to', saveFilePath + '/data.dsmed')
	})

	createWindow()

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
