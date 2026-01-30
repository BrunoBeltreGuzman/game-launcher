const btnSave = document.getElementById("btnSave");
const btnDiscard = document.getElementById("btnDiscard");
const preConfig = document.getElementById("config");

btnSave.addEventListener("click", async () => {
    try {
        const save = await window.api.saveConfig(preConfig.value);
        if (save) {
            alert("Settings saved!");
        } else {
            alert("Settings not saved!");
        }
    } catch (error) {
        console.error(error);
        alert("Error saving settings!");
    }
    await loadConfig();
});

btnDiscard.addEventListener("click", async () => {
    await loadConfig();
});

async function loadConfig() {
    const config = await window.api.getConfig();
    preConfig.value = JSON.stringify(config, null, 2);
}

loadConfig();