import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- DÉCLARATION DE L'API ELECTRON (Pour éviter les erreurs TypeScript) ---
declare global {
  interface Window {
    electronAPI: {
      saveTasks: (tasks: string[]) => void;
      loadTasks: () => Promise<string[]>;
    };
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  tasks: string[] = [];
  newTask: string = '';

  // Cette fonction s'exécute dès que l'app Angular est prête
  async ngOnInit() {
    try {
      // On demande au processus Main via le Preload de charger les tâches
      const savedTasks = await window.electronAPI.loadTasks();
      if (savedTasks) {
        this.tasks = savedTasks;
      }
    } catch (e) {
      console.error("Erreur lors du chargement des tâches :", e);
    }
  }

  // Ajouter une tâche à la liste
  addTask() {
    if (this.newTask.trim() !== '') {
      this.tasks.push(this.newTask.trim());
      this.save();
      this.newTask = ''; // On vide le champ de saisie
    }
  }

  // Supprimer une tâche via son index
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.save();
  }

  // Envoyer la liste mise à jour au processus Main pour sauvegarde sur le disque
  private save() {
    window.electronAPI.saveTasks(this.tasks);
  }
}