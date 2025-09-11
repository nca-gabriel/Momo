import type { noteState } from "./note.schema";
import { noteAction } from "./note.action";

export function noteReducer(state: noteState, action: noteAction): noteState {
  switch (action.type) {
    case "INIT_NOTE":
      return action.payload;
    case "ADD_NOTE":
      return [...state, action.payload];
    case "UPDATE_NOTE":
      return state.map((note) =>
        note.id === action.payload.id
          ? { ...note, ...action.payload.data }
          : note
      );
    case "DELETE_NOTE":
      return state.filter((note) => note.id !== action.payload.id);
    default:
      return state;
  }
}
