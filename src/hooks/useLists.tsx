import { useEffect, useReducer } from "react";
import { listReducer } from "@/utils/list.reducer";
import { listInput } from "@/utils/list.schema";

const STORAGE_KEY = "lists";

export function useLists() {
  const [lists, dispatch] = useReducer(listReducer, []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      dispatch({ type: "INIT_LISTS", payload: JSON.parse(raw) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  const addList = (list: listInput) => {
    dispatch({ type: "ADD_LIST", payload: list });
  };

  const updateList = (id: string, data: Partial<listInput>) => {
    dispatch({ type: "UPDATE_LIST", payload: { id, data } });
  };

  const deleteList = (id: string) => {
    dispatch({ type: "DELETE_LIST", payload: { id } });
  };

  return {
    lists,
    addList,
    updateList,
    deleteList,
  };
}
