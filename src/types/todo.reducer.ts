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
    default:
      return state;
  }
}
