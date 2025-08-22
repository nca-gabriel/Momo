import { todoInput, subTodoInput, TodoState } from "./todo.schema";

export type TodoAction =
  | { type: "INIT_TODOS"; payload: TodoState }
  | { type: "ADD_TODO"; payload: todoInput }
  | { type: "UPDATE_TODO"; payload: { id: string; data: Partial<todoInput> } }
  | { type: "DELETE_TODO"; payload: { id: string } }
  | { type: "ADD_SUBTODO"; payload: { todoId: string; subTodo: subTodoInput } }
  | {
      type: "UPDATE_SUBTODO";
      payload: {
        todoId: string;
        subTodoId: string;
        subTodo: Partial<subTodoInput>;
      };
    }
  | { type: "DELETE_SUBTODO"; payload: { todoId: string; subTodoId: string } };
