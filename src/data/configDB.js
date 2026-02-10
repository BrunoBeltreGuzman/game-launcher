const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const filePath = path.join(app.getPath('userData'), 'data', 'config.json');
const config = require('../config/config');

let cache = null;

function readDB() {
    if (cache) return cache;
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
    }
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        cache = data;
        return data;
    } catch (error) {
        console.error(error);
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
        return readDB();
    }
}

function saveConfig(_, data) {
    fs.writeFileSync(filePath, data);
    app.relaunch();
    app.exit(0);
    return data;
}

function getConfig() {
    return readDB();
}

module.exports = {
    getConfig,
    saveConfig
};
