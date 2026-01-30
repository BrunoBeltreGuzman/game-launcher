const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { getConfig, saveConfig } = require('./data/configDB');
const { restartPC, shutdownPC, executeGame } = require('./core/controller');
const { getLocalGames, updateGameLastUse } = require('./core/games');
const fs = require('fs');
const config = getConfig();

function createAppWindow() {
    const win = new BrowserWindow({
        width: screen.getPrimaryDisplay().workAreaSize.width,
        height: screen.getPrimaryDisplay().workAreaSize.height,
        fullscreen: true,
        autoHideMenuBar: true,
        simpleFullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'core', 'preload.js'),
            sandbox: false,
            webSecurity: true,
            allowRunningInsecureContent: false,
            nodeIntegration: false,
            contextIsolation: true,
        }
    });    
    win.loadFile(path.join(__dirname, 'view', 'windows', 'app', 'index.html'));
    if (config.dev.isDev) {
        win.webContents.openDevTools();
        const userData = app.getPath('userData');
        const foldersToClear = ['cache', 'data'];
        foldersToClear.forEach(folder => {
            const fullPath = path.join(userData, folder);
            if (config.dev.removeLocalData) fs.rmSync(fullPath, { recursive: true, force: true });
        });
    }
}

function createSettingsWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 700,
        autoHideMenuBar: true,
        simpleFullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, 'core', 'preload.js'),
            sandbox: false,
            webSecurity: true,
            allowRunningInsecureContent: false,
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    win.loadFile(path.join(__dirname, 'view', 'windows', 'settings', 'index.html'));

    if (config.dev.isDev) {
        win.webContents.openDevTools();
    }
}

ipcMain.handle('execute-game', executeGame);
ipcMain.handle('shutdown-pc', shutdownPC);
ipcMain.handle('restart-pc', restartPC);
ipcMain.handle('get-local-games', getLocalGames);
ipcMain.handle('update-game-last-use', updateGameLastUse);
ipcMain.handle('open-settings-window', createSettingsWindow);
ipcMain.handle('get-config', getConfig);
ipcMain.handle('save-config', saveConfig);

app.whenReady().then(() => {
    if (app.isPackaged) {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath('exe')
        });
    }
});

app.whenReady().then(() => {
    try {
        createAppWindow();
    } catch (error) {
        console.error(error);
    }
});