import { noteInput, noteState } from "./note.schema";

export type noteAction =
  | { type: "INIT_NOTE"; payload: noteState }
  | { type: "ADD_NOTE"; payload: noteInput }
  | { type: "UPDATE_NOTE"; payload: { id: string; data: Partial<noteInput> } }
  | { type: "DELETE_NOTE"; payload: { id: string } };
