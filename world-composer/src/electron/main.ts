import { app, BrowserWindow, ipcMain, dialog, Event, IpcMain } from 'electron';
import { join } from 'path';

// TODO: add support for remembering window custum size and position: https://github.com/mawie81/electron-window-state

// keep a global reference of the window object to prevent garbage collecting it
let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
    // Create the browser window.
    return new BrowserWindow({
        width: 800,
        height: 600,
        // if we want use ipcRenderer and general communication, we need to
        // intergrate window with node
        webPreferences: {
            nodeIntegration: false,
            preload: join(__dirname, 'preload.js'),
        },
        // hide redundant menu in dev mode, press alt to show.
        autoHideMenuBar: true,
        show: false,
    });
}

function bootstrapAppWindow() {
    mainWindow = createMainWindow();
    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', bootstrapAppWindow);

app.on('window-all-closed', function onAllClosed() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function onActivate() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        bootstrapAppWindow();
    }
});

ipcMain.on('main-window-ready', function onMainWindowReady() {
    // do not show windows before react is ready
    if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
    }
});

ipcMain.on(
    'test',
    (ev: Event, arg: string) =>
        mainWindow && dialog.showMessageBox(mainWindow, { message: arg })
);
