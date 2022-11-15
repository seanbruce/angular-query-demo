import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TODO } from 'src/api/todos';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  template: `<div class="mt-8 mb-14 flex flex-col justify-center items-center">
    <ng-container *ngIf="addTodoMutation$.result$ | async as addMutation">
      <form
        [formGroup]="todoForm"
        (ngSubmit)="submit()"
        class="w-80 border p-4"
      >
        <div class="flex flex-col">
          <label for="title" class="text-slate-400"> Title </label>
          <input
            id="title"
            type="text"
            formControlName="title"
            class="border"
          />
        </div>

        <div class="flex flex-col">
          <label for="description" class="text-slate-400"> Description </label>
          <input
            id="description"
            type="text"
            formControlName="description"
            class="border"
          />
        </div>

        <button
          class="bg-sky-500 text-white px-2 py-1 rounded-sm	mt-4 disabled:bg-sky-300 disabled:cursor-not-allowed"
          type="submit"
          [disabled]="addMutation.isLoading"
        >
          {{ addMutation.isLoading ? '創建中...' : '新增' }}
        </button>
      </form>
    </ng-container>
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
  </div>`,
})
export class AppComponent {
  todos$ = this.todoService.getTodos().result$;
  addTodoMutation$ = this.todoService.addTodo();
  todoForm = this.fb.group({
    title: [''],
    description: [''],
  });

  constructor(private todoService: TodoService, private fb: FormBuilder) {}

  submit() {
    const { title, description } = this.todoForm.value;
    if (!title || !description) {
      window.alert('請輸入代辦內容');
      return;
    }
    this.addTodoMutation$.mutate(
      {
        ...this.todoForm.value,
        done: false,
      } as Omit<TODO, 'id'>,
      {
        onSuccess: () => {
          this.todoForm.reset();
        },
      }
    );
  }
}
