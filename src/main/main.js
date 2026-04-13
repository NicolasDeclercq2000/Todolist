const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const storage = require('./save'); // Import de notre module

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // On remonte d'un dossier (main -> src) puis on descend dans preload
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // On remonte d'un dossier (main -> src) puis on descend dans renderer
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
}

// --- Gestion des communications (IPC) ---

// Écoute l'enregistrement
ipcMain.on('save-tasks', (event, tasks) => {
    storage.save(tasks);
});

// Gère la demande de chargement (retourne une valeur)
ipcMain.handle('load-tasks', () => {
    return storage.load();
});

// --- Cycle de vie de l'app ---

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});