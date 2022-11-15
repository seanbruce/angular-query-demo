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
        class="w-80 border p-4 mb-4"
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
    <button
      class="bg-sky-500 text-white px-2 py-1 rounded-sm"
      (click)="showTodoList = !showTodoList"
    >
      {{ showTodoList ? '隱藏代辦' : '顯示代辦' }}
    </button>
    <app-todos *ngIf="showTodoList"></app-todos>
  </div>`,
})
export class AppComponent {
  addTodoMutation$ = this.todoService.addTodo();
  todoForm = this.fb.group({
    title: [''],
    description: [''],
  });
  showTodoList = true;

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
