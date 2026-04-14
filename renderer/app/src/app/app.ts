import { Component, signal } from '@angular/core';

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
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('app');
}
