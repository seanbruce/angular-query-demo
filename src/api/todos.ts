import {
  of,
  delay,
  map,
  tap,
  throwError,
  MonoTypeOperatorFunction,
} from 'rxjs';

export interface TODO {
  id: string;
  title: string;
  description: string;
  done: boolean;
}

const easyId = () => Math.random().toString(32).slice(2);
const delayMax: <T>(milliseconds: number) => MonoTypeOperatorFunction<T> = (
  milliseconds
) => delay(Math.ceil(Math.random() * milliseconds));

const TODO_TABLE: TODO[] = [
  { id: easyId(), title: 'Learn angular query', description: '', done: false },
];

const getTodos = () => {
  console.log('Requesting getTodos');
  return of(TODO_TABLE).pipe(delayMax(3000));
};

const toggleTodos = (id: string) => {
  console.log('Requesting toggleTodos');
  return of(id).pipe(
    delayMax(3000),
    tap((id) => {
      const todo = TODO_TABLE.find((t) => t.id === id);
      if (todo) {
        todo.done = !todo.done;
        return todo;
      }
      throw Error(`No todo found with id: ${id}`);
    }),
    map((id) => {
      return { ...TODO_TABLE.find((t) => t.id === id)! };
    })
  );
};

const addTodo = (todo: Omit<TODO, 'id'>) => {
  console.log('Requesting addTodo');
  return of(todo).pipe(
    delayMax(3000),
    map((todo) => ({ ...todo, id: easyId() } as TODO)),
    tap((todo) => {
      TODO_TABLE.push(todo);
    })
  );
};

const deleteTodo = (id: string) => {
  console.log('Requesting deleteTodo');
  return of(id).pipe(
    delayMax(3000),
    map((id) => {
      const todo = TODO_TABLE.find((t) => t.id === id);
      if (todo) {
        return todo;
      }
      throw Error(`No todo found with id: ${id}`);
    }),
    tap(() => {
      const index = TODO_TABLE.findIndex((todo) => todo.id === id);
      if (~index) {
        TODO_TABLE.splice(index, 1);
      }
    })
  );
};

export { getTodos, toggleTodos, addTodo, deleteTodo };
