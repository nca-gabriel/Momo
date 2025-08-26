import { todoInput, TodoState } from "./todo.schema";

export type TodoAction =
  | { type: "INIT_TODOS"; payload: TodoState }
  | { type: "ADD_TODO"; payload: todoInput }
  | { type: "UPDATE_TODO"; payload: { id: string; data: Partial<todoInput> } }
  | { type: "DELETE_TODO"; payload: { id: string } };
