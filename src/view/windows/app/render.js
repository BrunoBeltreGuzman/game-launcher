import { executeGame, getLocalGames, updateGameLastUse } from "./util/games.js";
import { playSound, SOUND } from "./util/sound.js";

const MOVE_DELAY = 200;
const HOLD_TIME = 1500;
const SELECT_GAME_DELAY = 5000;

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
let settingsWindowOpened = false;
let config = null;

const cards = () => document.querySelectorAll('.card');

async function renderGames() {
    const container = document.getElementById('container');
    container.innerHTML = "<p>Cargando juegos, por favor espere...</p>";
    const localGames = await getLocalGames();
    config = await window.api.getConfig();

    if (config.dev.isDev) console.log(localGames);

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
            <img src="${imageUrl}" class="card-image" alt="${game.localName}">
        `;
        card.addEventListener('click', async () => {
            if (isPlay) return;
            isPlay = true;
            lastMove = Date.now();
            selectedIndex = 0;
            executeGame(game.path);
            updateGameLastUse(game.localName);
            playSound(SOUND.PLAY, config);
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

    // Axes move
    if (gp.axes[0] > 0.5) moveSelection(1);
    if (gp.axes[0] < -0.5) moveSelection(-1);
    if (gp.axes[1] > 0.5) moveSelection(cols);
    if (gp.axes[1] < -0.5) moveSelection(-cols);

    // X/A start game
    if (gp.buttons[0].pressed) {
        cards()[selectedIndex]?.click();
    }

    // O/B pressed long shutdown pc
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

    // cuadrado/X pressed long restart pc
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

    // triangulo/Y pressed long close app
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

    // start button open settings window
    if (gp.buttons[9].pressed) {
        if (!settingsWindowOpened) {
            settingsWindowOpened = true; // Bloqueamos nuevas ejecuciones
            window.api.openSettingsWindow();
        }
    } else {
        // Cuando el usuario suelta el botón, permitimos que se pueda abrir de nuevo
        settingsWindowOpened = false;
    }


    // D-Pad move
    if (gp.buttons[15].pressed) moveSelection(1);
    if (gp.buttons[14].pressed) moveSelection(-1);
    if (gp.buttons[13].pressed) moveSelection(cols);
    if (gp.buttons[12].pressed) moveSelection(-cols);
}

window.addEventListener("keydown", (e) => {
    const key = e.key;
    switch (key) {
        case "Tab": // Tab key move
            moveSelection(1);
            break;
        case "Enter": // Enter key start game
            cards()[selectedIndex]?.click();
            break;
        case "Escape": // Esc key open settings window
            window.api.openSettingsWindow();
            break;
        default:
            break;
    }

    const cols = getColumns();

    if (key === "d") moveSelection(1);
    if (key === "a") moveSelection(-1);
    if (key === "s") moveSelection(cols);
    if (key === "w") moveSelection(-cols);
});

function moveSelection(step) {
    const list = cards();
    selectedIndex = Math.max(0, Math.min(list.length - 1, selectedIndex + step));
    list.forEach(c => c.classList.remove('active'));
    list[selectedIndex].classList.add('active');
    list[selectedIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    lastMove = Date.now();
    playSound(SOUND.MOVE, config);
}

function refreshListView() {
    const list = cards();
    list.forEach(c => c.classList.remove('active'));
    if (list[selectedIndex]) list[selectedIndex].classList.add('active');
    window.scrollTo(0, 0);
}

renderGames().then(() => playSound(SOUND.SYSTEM, config));