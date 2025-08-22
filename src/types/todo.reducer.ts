import type { TodoState } from "./todo.schema";
import { TodoAction } from "./todo.action";

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "INIT_TODOS":
      return action.payload;
    case "ADD_TODO":
      return [...state, action.payload];

    case "UPDATE_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.data }
          : todo
      );
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload.id);
    case "ADD_SUBTODO":
      return state.map((todo) =>
        todo.id === action.payload.todoId
          ? { ...todo, subTodos: [...todo.subTodos, action.payload.subTodo] }
          : todo
      );
    case "UPDATE_SUBTODO":
      return state.map((todo) =>
        todo.id === action.payload.todoId
          ? {
              ...todo,
              subTodos: todo.subTodos.map((sub) =>
                sub.id === action.payload.subTodoId
                  ? { ...sub, ...action.payload.subTodo }
                  : sub
              ),
            }
          : todo
      );

    case "DELETE_SUBTODO":
      return state.map((todo) =>
        todo.id === action.payload.todoId
          ? {
              ...todo,
              subTodos: todo.subTodos.filter(
                (sub) => sub.id !== action.payload.subTodoId
              ),
            }
          : todo
      );

    default:
      return state;
  }
}
