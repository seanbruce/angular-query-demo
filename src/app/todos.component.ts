import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todos',
  template: `
    <div class="w-80 min-h-[300px] flex flex-col border m-4">
      <ng-container *ngIf="todos$ | async as todos">
        <div *ngIf="todos.isLoading" class="m-auto">數據請求中...</div>

        <div
          *ngIf="todos.isError"
          class="flex flex-col justify-center items-center m-auto"
        >
          <p>數據請求失敗</p>
          <button class="text-sm text-blue-500" (click)="todos.refetch()">
            重試
          </button>
        </div>

        <div *ngIf="todos.isSuccess">
          <h3
            class="relative font-bold text-slate-700 text-center p-2 bg-slate-100"
          >
            待辦事項
            <span
              *ngIf="todos.isFetching"
              class="text-xs absolute right-2 bottom-2.5 font-normal"
              >數據同步中</span
            >
          </h3>
          <ul>
            <app-todo *ngFor="let todo of todos.data" [todo]="todo"></app-todo>
          </ul>
        </div>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit, OnDestroy {
  todos$ = this.todoService.getTodos().result$;
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    console.log('destroy todos');
  }
}
