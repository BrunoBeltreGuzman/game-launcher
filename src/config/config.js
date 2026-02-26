module.exports = {
    system: {
        openAtWindowsStartup: true,
        closeAppOnGameLaunch: false,
        activeThemeColor: "default"
    },
    igdb: {
        clientId: "ywwhqisuzjd0xycj7ad1sj12jp74ti",
        accessToken: "y4b4i1n9y0jxtmgsrw47u2jm04pav3"
    },
    audio: {
        enableStartupSound: true,
        enableMoveSound: true,
        enablePlaySound: true
    },
    gameScanPaths: [
        "C:/Users/Admin/Desktop",
        "C:/Users/Public/Desktop"
    ],
    supportedGameExtensions: [
        "lnk",
        "url",
        "exe"
    ],
    development: {
        enabled: false,
        clearLocalDataOnStart: false
    },
    cleanupFolders: [
        "cache",
        "data"
    ],
    themes: [
        {
            key: "default",
            name: "Default",
            description: "Tema base por defecto",
        },
        {
            key: "tierra",
            name: "Tierra Retro y Monocromo",
            description: "Tema inspirado en la naturaleza, con colores tierra y verdes para una experiencia más orgánica.",
        },
        {
            key: "electrico",
            name: "Glitch Eléctrico y Morado",
            description: "Tema vibrante con colores neón y contrastes fuertes, ideal para los amantes de la estética cyberpunk.",
        }
    ],
};
