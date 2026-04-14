import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- DÉCLARATION DE L'INTERFACE ELECTRON ---
// Cela permet à TypeScript de reconnaître window.electronAPI sans erreur
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

  // On injecte le ChangeDetectorRef pour forcer la mise à jour de la vue
  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Initialisation du composant :
   * On récupère les tâches stockées via le pont Electron (Preload).
   */
  async ngOnInit() {
    try {
      const savedTasks = await window.electronAPI.loadTasks();
      if (savedTasks) {
        this.tasks = savedTasks;
        // On force Angular à rafraîchir l'affichage car la donnée 
        // arrive d'un processus externe (Electron)
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error("Impossible de charger les tâches depuis Electron :", error);
    }
  }

  /**
   * Ajoute une nouvelle tâche à la liste et déclenche la sauvegarde.
   */
  addTask() {
    const taskToAdd = this.newTask.trim();
    if (taskToAdd !== '') {
      this.tasks.push(taskToAdd);
      this.save();
      this.newTask = ''; // On vide le champ après l'ajout
    }
  }

  /**
   * Supprime une tâche de la liste via son index et sauvegarde.
   */
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.save();
  }

  /**
   * Envoie la liste actuelle des tâches vers le processus Main (via Preload)
   * pour l'écriture dans le fichier de stockage.
   */
  private save() {
    try {
      window.electronAPI.saveTasks(this.tasks);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  }
}