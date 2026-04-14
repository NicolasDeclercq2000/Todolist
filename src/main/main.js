const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const storage = require('./save'); // Ton fichier de sauvegarde

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            // Le preload est dans src/preload/preload.js
            preload: path.join(__dirname, '../preload/preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // --- CONSTRUCTION DU CHEMIN ANGULAR ---
    
    // On définit les deux chemins possibles (avec ou sans /browser)
    const pathWithBrowser = path.resolve(__dirname, '../../renderer/app/dist/app/browser/index.html');
    const pathSimple = path.resolve(__dirname, '../../renderer/app/dist/app/index.html');

    // On teste quel fichier existe réellement sur ton Mac
    if (fs.existsSync(pathWithBrowser)) {
        console.log("✅ Chargement depuis : dist/app/browser/");
        win.loadFile(pathWithBrowser);
    } else if (fs.existsSync(pathSimple)) {
        console.log("✅ Chargement depuis : dist/app/");
        win.loadFile(pathSimple);
    } else {
        // Si aucun n'existe, on affiche une erreur claire dans ton terminal
        console.error("❌ ERREUR CRITIQUE : Fichier index.html introuvable !");
        console.error("Vérifie que tu as bien lancé : ng build --base-href ./");
        console.log("Chemin tenté : " + pathWithBrowser);
    }

    // Optionnel : ouvre les outils de dév pour voir les erreurs Angular
    // win.webContents.openDevTools();
}

// --- COMMUNICATION IPC (Sauvegarde) ---

ipcMain.on('save-tasks', (event, tasks) => {
    storage.save(tasks);
});

ipcMain.handle('load-tasks', () => {
    return storage.load();
});

// --- CYCLE DE VIE ---

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});