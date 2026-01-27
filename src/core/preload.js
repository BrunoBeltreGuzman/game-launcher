const { contextBridge, ipcRenderer } = require('electron');
const config = require('../config/config');

contextBridge.exposeInMainWorld('api', {
    executeGame: (gamePath) => {
        return ipcRenderer.invoke('execute-game', gamePath)
    },
    getLocalGames: async () => {
        return await ipcRenderer.invoke('get-local-games');
    },
    updateGameLastUse: (localName) => {
        return ipcRenderer.invoke('update-game-last-use', localName);
    },
    shutdownPc: () => {
        return ipcRenderer.invoke('shutdown-pc');
    },
    restartPc: () => {
        return ipcRenderer.invoke('restart-pc');
    },
    config: config
});
