import { tagInput, tagState } from "./tag.schema";

export type tagAction =
  | { type: "INIT_TAGS"; payload: tagState }
  | { type: "ADD_TAG"; payload: tagInput }
  | { type: "UPDATE_TAG"; payload: { id: string; data: Partial<tagInput> } }
  | { type: "DELETE_TAG"; payload: { id: string } };
