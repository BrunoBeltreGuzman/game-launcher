const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const { gamePaths, gameExtensions } = require('../config/config');
const config = require('../config/config');
const { getByLocalNameAndPath, saveAll, getAll, save, updateGameByLocalName, getGameByLocalName } = require('../data/service');

contextBridge.exposeInMainWorld('data', {
    getLocalGames: async () => {
        let games = [];
        const gamesDB = getAll();
        const filtroExtensiones = new RegExp(`\\.(${gameExtensions.join('|')})$`, 'i');

        for (const gamePath of gamePaths) {
            if (!fs.existsSync(gamePath)) continue;
            for (const gameName of fs.readdirSync(gamePath)) {
                const fullPath = path.join(gamePath, gameName);
                try {
                    const stat = fs.statSync(fullPath);
                    if (!stat.isDirectory() && gameName.match(filtroExtensiones)) {
                        const name = gameName.replace(filtroExtensiones, '');
                        const gameDb = getByLocalNameAndPath(name, fullPath);
                        if (gameDb != null) {
                            if (gameDb.imagePath == gameDb.localName) {
                                gameDb.imagePath = await getImage(name);
                                updateGameByLocalName(gameDb);
                            }
                            games.push(gameDb);
                        } else {
                            const newGame = {
                                localName: name,
                                searchName: name,
                                path: fullPath,
                                imagePath: await getImage(name),
                                lastUse: null
                            }
                            games.push(newGame);
                            gamesDB.push(newGame)
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
        games.sort((a, b) => {
            const aTime = a.lastUse ? new Date(a.lastUse).getTime() : 0;
            const bTime = b.lastUse ? new Date(b.lastUse).getTime() : 0;
            return bTime - aTime;
        });
        saveAll(gamesDB);
        return games;
    }
});


async function getImage(gameName) {
    try {
        const data = await fetch(`https://api.igdb.com/v4/games`, {
            method: 'POST',
            headers: {
                'Client-ID': config.igdb.clientId,
                "Authorization": "Bearer " + config.igdb.accessToken,
                'Content-Type': 'text/plain'
            },
            body: `search "${normalizeGameName(gameName)}";\nfields name, cover.url, cover.image_id, game_type;`
        });
        const json = await data.json()
        const imageId = json[0]?.cover?.image_id;
        const imageUrl = `https://images.igdb.com/igdb/image/upload/t_1080p/${imageId}.jpg`;
        const cachePath = path.join(process.cwd(), 'cache');
        if (!fs.existsSync(cachePath)) {
            fs.mkdirSync(cachePath, { recursive: true });
        }
        const filePath = path.join(cachePath, `${imageId}.jpg`);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error('No se pudo descargar la imagen');
        }
        const buffer = Buffer.from(await imageResponse.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        return filePath;
    } catch (error) {
        console.error(error);
        return gameName;
    }
}

function normalizeGameName(name) {
    name = name.split('.')[0];
    return name;
}

contextBridge.exposeInMainWorld('api', {
    executeGame: (gamePath) => {
        return ipcRenderer.invoke('execute-game', gamePath)
    },
    updateGameLastUse: (localName) => {
        const game = getGameByLocalName(localName);
        game.lastUse = new Date();
        updateGameByLocalName(game);
        return game;
    },
    config: config
});
