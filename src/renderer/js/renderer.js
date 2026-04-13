const input = document.getElementById('todo-input');
const btn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

// Sauvegarder l'état actuel
function saveAll() {
    const tasks = [];
    document.querySelectorAll('.task-text').forEach(span => {
        tasks.push(span.textContent);
    });
    window.electronAPI.saveTasks(tasks);
}

// Ajouter visuellement une tâche
function addTaskToDOM(text) {
    const li = document.createElement('li');
    
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = text;
    
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Supprimer';
    delBtn.onclick = () => {
        li.remove();
        saveAll();
    };
    
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
}

// Au démarrage : charger les données
window.electronAPI.loadTasks().then(tasks => {
    tasks.forEach(task => addTaskToDOM(task));
});

// Événement clic
btn.addEventListener('click', () => {
    if (input.value.trim() !== '') {
        addTaskToDOM(input.value);
        saveAll();
        input.value = '';
    }
});

// touche Entrée pour ajouter
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btn.click();
});