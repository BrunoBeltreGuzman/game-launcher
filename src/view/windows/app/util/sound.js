export const SOUND = {
    PLAY: './sound/play.wav',
    SYSTEM: './sound/system.mp3',
    MOVE: './sound/move.wav'
}

export function playSound(src, config, volume = 1.0) {
    const soundConfig = config.audio;
    if (src === SOUND.SYSTEM && !soundConfig.enableStartupSound) return;
    if (src === SOUND.MOVE && !soundConfig.enableMoveSound) return;
    if (src === SOUND.PLAY && !soundConfig.enablePlaySound) return;
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => { });
}