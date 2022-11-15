import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TODO } from 'src/api/todos';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo',
  template: `
    <ng-container *ngIf="deleteTodoMutation$.result$ | async as deleteMutation">
      <ng-container
        *ngIf="toggleTodoMutation$.result$ | async as toggleMutation"
      >
        <li
          class="border p-1 pl-3 truncate flex items-baseline gap-2"
          [class]="[
            toggleMutation.isLoading ? 'cursor-progress' : 'cursor-pointer',
            toggleMutation.isLoading ? 'text-slate-300' : 'text-slate-500'
          ]"
          (click)="toggleTodo(todo.id)"
        >
          <span *ngIf="todo.done; else notDone">✅</span>
          <ng-template #notDone>
            <span>⏳</span>
          </ng-template>
          {{ todo.title }}
          <span *ngIf="toggleMutation.isLoading" class="text-xs text-slate-300"
            >請求中</span
          >
          <button
            class="text-xs text-red-400 ml-auto px-2 font-bold hover:text-red-600 disabled:text-red-200"
            [disabled]="deleteMutation.isLoading"
            (click)="deleteTodo(todo.id, $event)"
          >
            刪除
          </button>
        </li>
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  @Input() todo!: TODO;
  toggleTodoMutation$ = this.todoService.toggleTodo();
  deleteTodoMutation$ = this.todoService.deleteTodo();

  constructor(private todoService: TodoService) {}

  toggleTodo(id: string) {
    if (
      this.toggleTodoMutation$.getCurrentResult().isLoading ||
      this.deleteTodoMutation$.getCurrentResult().isLoading
    ) {
      return;
    }
    this.toggleTodoMutation$.mutate(id);
  }

  deleteTodo(id: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.deleteTodoMutation$.getCurrentResult().isLoading) {
      return;
    }
    this.deleteTodoMutation$.mutate(id);
  }
}
