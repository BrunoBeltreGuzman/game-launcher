export function executeGame(gamePath) {
    window.api.executeGame(gamePath).then(res => {
        if (!res.success) {
            alert("No se pudo lanzar el juego");
            console.error(res.error);
        }
    });
}

export function updateGameLastUse() {
    return window.api.updateGameLastUse(localName);
}

export async function getLocalGames() {
    return await window.api.getLocalGames();
}