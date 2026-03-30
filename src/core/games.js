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
                    if (gameDb != null && !isOlderThan30Days(new Date(gameDb.loadDate))) {
                        console.log(`Usando juego ${name} de la base de datos`);
                        games.push(gameDb);
                    } else {
                        console.log(`Buscando juego ${name}`);
                        const imgPath = await getImage(name);
                        if (!imgPath) {
                            console.log(`No se pudo obtener la imagen de ${name}`);
                            continue;
                        }
                        const newGame = {
                            localName: name,
                            searchName: name,
                            path: fullPath,
                            imagePath: imgPath,
                            lastUse: new Date(),
                            loadDate: new Date()
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

function isOlderThan30Days(date) {
    const now = new Date();
    const diff = now - date;
    return diff > (30 * 24 * 60 * 60 * 1000);
}

function updateGameLastUse(_, localName) {
    const game = getGameByLocalName(localName);
    game.lastUse = new Date();
    updateGameByLocalName(game);
    return game;
}

module.exports = { getLocalGames, updateGameLastUse };