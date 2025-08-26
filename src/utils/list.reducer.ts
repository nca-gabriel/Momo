import type { ListState } from "./list.schema";
import { ListAction } from "./list.action";

export function tagReducer(state: ListState, action: ListAction): ListState {
  switch (action.type) {
    case "INIT_LISTS":
      return action.payload;
    case "ADD_LIST":
      return [...state, action.payload];
    case "UPDATE_LIST":
      return state.map((tag) =>
        tag.id === action.payload.id ? { ...tag, ...action.payload.data } : tag
      );
    case "DELETE_LIST":
      return state.filter((tag) => tag.id !== action.payload.id);
    default:
      return state;
  }
}
