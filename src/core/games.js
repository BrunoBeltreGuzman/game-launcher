const fs = require('fs');
const path = require('path');
const { getByLocalNameAndPath, saveAll, getGameByLocalName, updateGameByLocalName } = require('../data/gamesDB');
const { getImage } = require('./util');
const { getConfig } = require('../data/configDB');
const config = getConfig();

async function getLocalGames() {
    let games = [];
    const filtroExtensiones = new RegExp(`\\.(${config.supportedGameExtensions.join('|')})$`, 'i');
    for (const gamePath of config.gameScanPaths) {
        if (!fs.existsSync(gamePath)) continue;
        for (const gameName of fs.readdirSync(gamePath)) {
            const fullPath = path.join(gamePath, gameName);
            try {
                const stat = fs.statSync(fullPath);
                if (!stat.isDirectory() && gameName.match(filtroExtensiones)) {
                    const name = gameName.replace(filtroExtensiones, '');
                    const gameDb = getByLocalNameAndPath(name, fullPath);
                    if (gameDb != null) {
                        if (gameDb.imagePath == gameDb.localName || gameDb.imagePath.includes('undefined')) {
                            gameDb.imagePath = await getImage(name);
                        }
                        games.push(gameDb);
                    } else {
                        const imgPath = await getImage(name);
                        const newGame = {
                            localName: name,
                            searchName: name,
                            path: fullPath,
                            imagePath: imgPath,
                            lastUse: new Date()
                        }
                        games.push(newGame);
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
    saveAll(games);
    return games;
}


function updateGameLastUse(_, localName) {
    const game = getGameByLocalName(localName);    
    game.lastUse = new Date();
    updateGameByLocalName(game);
    return game;
}

module.exports = { getLocalGames, updateGameLastUse };