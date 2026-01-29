const { spawn } = require('child_process');

function executeGame(_, gamePath) {
    try {
        spawn('cmd.exe', [
            '/c',
            'start',
            '""',
            gamePath
        ], {
            detached: true,
            stdio: 'ignore'
        }).unref();
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: e.message };
    }
}

function restartPC() {
    spawn('shutdown', ['/r', '/t', '0'], {
        detached: true,
        stdio: 'ignore'
    }).unref();

    return { success: true };
}

function shutdownPC() {
    spawn('shutdown', ['/s', '/t', '0'], {
        detached: true,
        stdio: 'ignore'
    }).unref();

    return { success: true };
}

module.exports = {
    restartPC,
    shutdownPC,
    executeGame
};