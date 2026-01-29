const { contextBridge, ipcRenderer } = require('electron');

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
    openSettingsWindow: () => {
        return ipcRenderer.invoke('open-settings-window');
    },
    getConfig: () => {
        return ipcRenderer.invoke('get-config');
    },
    saveConfig: (config) => {
        return ipcRenderer.invoke('save-config', config);
    }
});
