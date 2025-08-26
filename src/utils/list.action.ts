import { listInput, ListState } from "./list.schema";

export type ListAction =
  | { type: "INIT_LISTS"; payload: ListState }
  | { type: "ADD_LIST"; payload: listInput }
  | { type: "UPDATE_LIST"; payload: { id: string; data: listInput } }
  | { type: "DELETE_LIST"; payload: { id: string } };
