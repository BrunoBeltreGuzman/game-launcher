const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { isDev } = require('./config/config');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, './core/preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            webSecurity: true,
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


ipcMain.handle('shutdown-pc', () => {
    spawn('shutdown', ['/s', '/t', '0'], {
        detached: true,
        stdio: 'ignore'
    }).unref();

    return { success: true };
});

ipcMain.handle('restart-pc', () => {
    spawn('shutdown', ['/r', '/t', '0'], {
        detached: true,
        stdio: 'ignore'
    }).unref();

    return { success: true };
});


app.whenReady().then(() => {
    // Solo registrar el inicio automático si la app está empaquetada
    if (app.isPackaged) {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath('exe') // Esto le dice a Windows que abra el .exe instalado, no el de desarrollo
        });
    }
});

app.whenReady().then(createWindow);
