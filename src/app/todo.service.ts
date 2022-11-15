import { Injectable, inject } from '@angular/core';
import { QueryClientService, UseQuery, UseMutation } from '@ngneat/query';
import { tap } from 'rxjs';
import { getTodos, addTodo, deleteTodo, toggleTodos, TODO } from '../api/todos';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  #queryClient = inject(QueryClientService);
  #useQuery = inject(UseQuery);
  #useMutation = inject(UseMutation);

  getTodos() {
    return this.#useQuery(['todos', 'list'], () => {
      return getTodos();
    });
  }

  toggleTodo() {
    return this.#useMutation((id: string) => {
      return toggleTodos(id).pipe(
        tap({
          next: () => {
            this.#queryClient.invalidateQueries(['todos', 'list']);
          },
        })
      );
    });
  }

  addTodo() {
    return this.#useMutation((todo: Omit<TODO, 'id'>) => {
      return addTodo(todo).pipe(
        tap({
          next: () => {
            this.#queryClient.invalidateQueries(['todos', 'list']);
          },
        })
      );
    });
  }

  deleteTodo() {
    return this.#useMutation((id: string) => {
      return deleteTodo(id).pipe(
        tap({
          next: () => {
            this.#queryClient.invalidateQueries(['todos', 'list']);
          },
        })
      );
    });
  }
}
