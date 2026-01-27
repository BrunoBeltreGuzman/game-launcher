const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { isDev } = require('./config/config');
const { restartPC, shutdownPC, executeGame } = require('./core/controller');
const { getLocalGames, updateGameLastUse } = require('./core/games');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'core', 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            webSecurity: true,
            allowRunningInsecureContent: false,
        }
    });

    win.loadFile(path.join(__dirname, 'view', 'index.html'));
    if (isDev) {
        win.webContents.openDevTools();
        const userData = app.getPath('userData');
        const foldersToClear = ['cache', 'data'];
        foldersToClear.forEach(folder => {
            const fullPath = path.join(userData, folder);
            fs.rmSync(fullPath, { recursive: true, force: true });
        });
    }
}

ipcMain.handle('execute-game', (_, gamePath) => executeGame(gamePath));
ipcMain.handle('shutdown-pc', shutdownPC);
ipcMain.handle('restart-pc', restartPC);
ipcMain.handle('get-local-games', getLocalGames);
ipcMain.handle('update-game-last-use', (_, localGame) => updateGameLastUse(localGame));

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
        createWindow();
    } catch (error) {
        console.error(error);
    }
});