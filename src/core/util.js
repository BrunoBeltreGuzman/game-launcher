const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const cachePath = path.join(app.getPath('userData'), 'cache');
const { getConfig } = require('../data/configDB');
const config = getConfig();

function normalizeGameName(name) {
    name = name.split('.')[0];
    return name;
}

async function getImage(gameName) {
    try {
        const data = await fetch(`https://api.igdb.com/v4/games`, {
            method: 'POST',
            headers: {
                'Client-ID': config.igdb.clientId,
                "Authorization": "Bearer " + config.igdb.accessToken,
                'Content-Type': 'text/plain'
            },
            body: `search "${normalizeGameName(gameName)}";\nfields cover.image_id, game_type;`
        });
        const json = await data.json();
        if (json && json.length) {
            json.sort((a, b) => {
                return a.game_type - b.game_type;
            });
        }
        const gameWithCover = json.find(game => game?.cover?.image_id);
        const imageId = gameWithCover?.cover?.image_id;
        const imageUrl = `https://images.igdb.com/igdb/image/upload/t_1080p/${imageId}.jpg`;
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

module.exports = { getImage };