const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const filePath = path.join(app.getPath('userData'), 'data', 'gamesDB.json');

function readDB() {
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    return data;
}

function saveAll(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getAll() {
    return readDB();
}

function updateGameByLocalName(game) {
    const data = readDB();
    const index = data.findIndex(g => g.localName === game.localName);
    if (index !== -1) {
        data[index] = game;
        saveAll(data);
    }
    return game;
}

function getByLocalNameAndPath(localName, gamePath) {
    const data = readDB();
    return data.find(
        g => g.localName === localName && g.path === gamePath
    );
}

function getGameByLocalName(localName) {
    const data = readDB();
    return data.find(
        g => g.localName === localName
    );
}

module.exports = {
    getAll,
    saveAll,
    getByLocalNameAndPath,
    updateGameByLocalName,
    getGameByLocalName
};
