export interface Todo {
  id: string;
  title: string;
  status: boolean;
  tags: string;
  dateTime: Date;
}

export type TodoInput = Omit<Todo, "id">;
export type TodoUpdate = Partial<TodoInput> & { id: string };
