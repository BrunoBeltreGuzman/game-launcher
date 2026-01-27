const MOVE_DELAY = 200;
const HOLD_TIME = 1500;
const SELECT_GAME_DELAY = 5000;
const SOUND_PATH_PLAY = './sound/play.wav';
const SOUND_PATH_SYSTEM = './sound/system.mp3';
const SOUND_PATH_MOVE = './sound/move.wav';

let isPlay = false;
let gamepadIndex = null;
let lastMove = 0;
let selectedIndex = 0;
let bPressedAt = null;
let xPressedAt = null;
let yPressedAt = null;
let shutdownDone = false;
let restartDone = false;
let closeDone = false;

const cards = () => document.querySelectorAll('.card');

function executeGame(gamePath) {
    window.api.executeGame(gamePath).then(res => {
        if (!res.success) {
            alert("No se pudo lanzar el juego");
            console.error(res.error);
        }
    });
}

function playSound(src, volume = 1.0) {
    const soundConfig = window.api.config.sound;
    if (src === SOUND_PATH_SYSTEM && !soundConfig.startSound) return;
    if (src === SOUND_PATH_MOVE && !soundConfig.moveSound) return;
    if (src === SOUND_PATH_PLAY && !soundConfig.playSound) return;
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => { });
}

async function renderGames() {
    const container = document.getElementById('container');
    container.innerHTML = "<p>Cargando juegos, por favor espere...</p>";
    const localGames = await window.api.getLocalGames();
    if (window.api.config.isDev) console.log(localGames);
    
    container.innerHTML = '';

    if (localGames.length === 0) {
        container.innerHTML = "<p>No se encontraron juegos.</p>";
        return;
    }

    const fragment = document.createDocumentFragment();
    for (const game of localGames) {
        const imageUrl = game.imagePath;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${imageUrl}" alt="${game.localName}">
        `;
        card.addEventListener('click', async () => {
            if (isPlay) return;
            isPlay = true;
            lastMove = Date.now();
            selectedIndex = 0;
            executeGame(game.path);
            window.api.updateGameLastUse(game.localName);
            playSound(SOUND_PATH_PLAY);
            setTimeout(async () => {
                isPlay = false;
                await renderGames();
                refreshListView();
            }, SELECT_GAME_DELAY);
        });
        fragment.appendChild(card);
    }
    container.appendChild(fragment);
    refreshListView();
}

renderGames();
playSound(SOUND_PATH_SYSTEM);

window.addEventListener("gamepadconnected", (e) => {
    gamepadIndex = e.gamepad.index;
    refreshListView();
});

window.addEventListener("gamepaddisconnected", () => {
    gamepadIndex = null;
    refreshListView();
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

    // Axes
    if (gp.axes[0] > 0.5) moveSelection(1);
    if (gp.axes[0] < -0.5) moveSelection(-1);
    if (gp.axes[1] > 0.5) moveSelection(cols);
    if (gp.axes[1] < -0.5) moveSelection(-cols);

    // A
    if (gp.buttons[0].pressed) {
        cards()[selectedIndex]?.click();
    }

    // B pressed long shutdown pc
    if (gp.buttons[1].pressed) {
        if (!bPressedAt) bPressedAt = now;

        if (now - bPressedAt > HOLD_TIME && !shutdownDone) {
            shutdownDone = true;
            window.api.shutdownPc();
        }
    } else {
        bPressedAt = null;
        shutdownDone = false;
    }

    // X pressed long restart pc
    if (gp.buttons[2].pressed) {
        if (!xPressedAt) xPressedAt = now;

        if (now - xPressedAt > HOLD_TIME && !restartDone) {
            restartDone = true;
            window.api.restartPc();
        }
    } else {
        xPressedAt = null;
        restartDone = false;
    }

    // Y pressed long close app
    if (gp.buttons[3].pressed) {
        if (!yPressedAt) yPressedAt = now;

        if (now - yPressedAt > HOLD_TIME && !restartDone) {
            restartDone = true;
            window.close();
        }
    } else {
        yPressedAt = null;
        closeDone = false;
    }

    // D-Pad
    if (gp.buttons[15].pressed) moveSelection(1);
    if (gp.buttons[14].pressed) moveSelection(-1);
    if (gp.buttons[13].pressed) moveSelection(cols);
    if (gp.buttons[12].pressed) moveSelection(-cols);
}



window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "Tab":
            moveSelection(1);
            break;
        case "Enter":
            cards()[selectedIndex]?.click();
            break;
        default:
            break;
    }
});

function moveSelection(step) {
    const list = cards();
    selectedIndex = Math.max(0, Math.min(list.length - 1, selectedIndex + step));
    list.forEach(c => c.classList.remove('active'));
    list[selectedIndex].classList.add('active');
    list[selectedIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    lastMove = Date.now();
    playSound('./sound/move.wav');
}


function refreshListView() {
    const list = cards();
    list.forEach(c => c.classList.remove('active'));
    if (list[selectedIndex]) list[selectedIndex].classList.add('active');
    window.scrollTo(0, 0);
}