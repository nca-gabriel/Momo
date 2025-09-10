import type { tagState } from "./tag.schema";
import { tagAction } from "./tag.action";

export function tagReducer(state: tagState, action: tagAction): tagState {
  switch (action.type) {
    case "INIT_TAGS":
      return action.payload;
    case "ADD_TAG":
      return [...state, action.payload];
    case "UPDATE_TAG":
      return state.map((tag) =>
        tag.id === action.payload.id ? { ...tag, ...action.payload.data } : tag
      );
    case "DELETE_TAG":
      return state.filter((tag) => tag.id !== action.payload.id);
    default:
      return state;
  }
}
