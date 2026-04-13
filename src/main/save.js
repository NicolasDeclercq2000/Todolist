const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Chemin : ~/Library/Application Support/my-electron-todo/todo-data.json
const DATA_PATH = path.join(app.getPath('userData'), 'todo-data.json');

module.exports = {
    save(tasks) {
        try {
            fs.writeFileSync(DATA_PATH, JSON.stringify(tasks));
        } catch (err) {
            console.error("Erreur de sauvegarde:", err);
        }
    },
    load() {
        try {
            if (fs.existsSync(DATA_PATH)) {
                const data = fs.readFileSync(DATA_PATH);
                return JSON.parse(data);
            }
        } catch (err) {
            console.error("Erreur de lecture:", err);
        }
        return [];
    }
};