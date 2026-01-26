const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const { gamePaths, gameExtensions } = require('../config/config');
const config = require('../config/config');

contextBridge.exposeInMainWorld('data', {
    getLocalGames: () => {
        let games = [];
        const filtroExtensiones = new RegExp(`\\.(${gameExtensions.join('|')})$`, 'i');
        gamePaths.forEach(gamePath => {
            if (!fs.existsSync(gamePath)) return;
            fs.readdirSync(gamePath).forEach(name => {
                const fullPath = path.join(gamePath, name);
                try {
                    const stat = fs.statSync(fullPath);
                    if (!stat.isDirectory() && name.match(filtroExtensiones)) {
                        games.push({
                            name: name.replace(filtroExtensiones, ''),
                            gamePath: fullPath
                        });
                    }
                } catch {
                    console.error(e);
                }
            });
        });
        return games;
    }
});

contextBridge.exposeInMainWorld('api', {
    executeGame: (gamePath) => {
        return ipcRenderer.invoke('execute-game', gamePath)
    },
    config: config
});
