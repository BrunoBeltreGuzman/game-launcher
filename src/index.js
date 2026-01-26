const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { isDev } = require('./config/config');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        fullscreen: true,      // pantalla completa
        autoHideMenuBar: true, // oculta menú
        webPreferences: {
            preload: path.join(__dirname, './core/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            webSecurity: true, // Mantén esto en true
            allowRunningInsecureContent: false,
        }
    });

    win.loadFile(path.join(__dirname, 'view', 'index.html'));
    if (isDev) win.webContents.openDevTools();
}

ipcMain.handle('execute-game', (_, gamePath) => {
    try {
        spawn('cmd.exe', [
            '/c',
            'start',
            '""',
            gamePath
        ], {
            detached: true,
            stdio: 'ignore'
        }).unref();
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: e.message };
    }
});

app.whenReady().then(createWindow);
