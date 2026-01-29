export const SOUND = {
    PLAY: '../../sound/play.wav',
    SYSTEM: '../../sound/system.mp3',
    MOVE: '../../sound/move.wav'
}

export function playSound(src, config, volume = 1.0) {
    const soundConfig = config.sound;
    if (src === SOUND.SYSTEM && !soundConfig.startSound) return;
    if (src === SOUND.MOVE && !soundConfig.moveSound) return;
    if (src === SOUND.PLAY && !soundConfig.playSound) return;
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => { });
}