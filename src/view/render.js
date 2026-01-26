const MOVE_DELAY = 200;
const SELECT_GAME_DELAY = 3000;
let isPlay = false;
let gamepadIndex = null;
let lastMove = 0;
let selectedIndex = 0;

const cards = () => document.querySelectorAll('.card');

function normalizeGameName(name) {
    name = name.split('.')[0];
    return name;
}

function selectURL(urls) {
    urls = urls.sort((a, b) => b.name - a.name);
    urls = urls.sort((a, b) => b.game_type + a.game_type);
    return urls[0].cover.image_id
}

async function getImagen(gameName) {
    try {
        const data = await fetch(`https://api.igdb.com/v4/games`, {
            method: 'POST',
            headers: {
                'Client-ID': window.api.config.igdb.clientId,
                "Authorization": "Bearer " + window.api.config.igdb.accessToken,
                'Content-Type': 'text/plain'
            },
            body: `search "${normalizeGameName(gameName)}";\nfields name, cover.url, cover.image_id, game_type;`
        });
        let json = await data.json()
        const url = selectURL(json);
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${url}.jpg`;
    } catch (error) {
        console.error(error);
    }
}

function executeGame(gamePath) {
    window.api.executeGame(gamePath).then(res => {
        if (!res.success) {
            alert("No se pudo lanzar el juego");
            console.error(res.error);
        }
    });
}

function playSound(src, volume = 1.0) {
    switch (src.split("/")[2]) {
        case "system.mp3":
            if (!window.api.config.sound.startSound) return;
            break;
        case "move.wav":
            if (!window.api.config.sound.moveSound) return;
            break;
        case "play.wav":
            if (!window.api.config.sound.playSound) return;
            break;
        default:
            break;
    }

    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => { });
}

async function renderGames() {
    const localGames = window.data.getLocalGames();
    const container = document.getElementById('container');

    if (localGames.length === 0) {
        container.innerHTML = "<p>No se encontraron juegos.</p>";
        return;
    }

    for (const game of localGames) {
        const imageUrl = await getImagen(game.name);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${imageUrl}" alt="${game.name}">
        `;
        card.addEventListener('click', () => {
            executeGame(game.gamePath);
        });
        container.appendChild(card);
    }
}

renderGames();
playSound('./sound/system.mp3');

window.addEventListener("gamepadconnected", (e) => {
    gamepadIndex = e.gamepad.index;
});

window.addEventListener("gamepaddisconnected", () => {
    gamepadIndex = null;
});

function gamepadLoop() {
    if (gamepadIndex !== null) {
        const gp = navigator.getGamepads()[gamepadIndex];
        if (gp) handleGamepad(gp);
    }
    requestAnimationFrame(gamepadLoop);
}

requestAnimationFrame(gamepadLoop);

function getColumns() {
    const container = document.getElementById('container');
    const card = document.querySelector('.card');
    if (!card) return 1;
    const containerWidth = container.clientWidth;
    const cardWidth = card.clientWidth;
    return Math.round(containerWidth / cardWidth);
}

function handleGamepad(gp) {
    const now = Date.now();
    if (now - lastMove < MOVE_DELAY) return;

    const cols = getColumns();

    // Horizontal
    if (gp.axes[0] > 0.5) moveSelection(1);
    if (gp.axes[0] < -0.5) moveSelection(-1);

    // Vertical exacto en línea
    if (gp.axes[1] > 0.5) moveSelection(cols);
    if (gp.axes[1] < -0.5) moveSelection(-cols);

    // A
    if (gp.buttons[0].pressed && !isPlay) {
        isPlay = !isPlay;
        playSound('./sound/play.wav');
        cards()[selectedIndex]?.click();
        lastMove = now;
        setTimeout(() => {
            isPlay = false;
        }, SELECT_GAME_DELAY);
    }

    // D-Pad
    if (gp.buttons[15].pressed) moveSelection(1);
    if (gp.buttons[14].pressed) moveSelection(-1);
    if (gp.buttons[13].pressed) moveSelection(cols);
    if (gp.buttons[12].pressed) moveSelection(-cols);
}


function moveSelection(step) {
    const list = cards();
    selectedIndex = Math.max(0, Math.min(list.length - 1, selectedIndex + step));
    list.forEach(c => c.classList.remove('active'));
    list[selectedIndex].classList.add('active');
    list[selectedIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    lastMove = Date.now();
    playSound('./sound/move.wav');
}
