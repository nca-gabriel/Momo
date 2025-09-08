import { useEffect, useReducer } from "react";
import { listReducer } from "@/utils/list/list.reducer";
import { listInput } from "@/utils/list/list.schema";

const STORAGE_KEY = "lists";

function initLists() {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  return [];
}

export function useLists() {
  const [lists, dispatch] = useReducer(listReducer, [], initLists);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  const addList = (list: Omit<listInput, "id" | "date">) => {
    dispatch({
      type: "ADD_LIST",
      payload: {
        ...list,
        id: crypto.randomUUID(),
        date: new Date(),
      },
    });
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
