import { useEffect, useReducer } from "react";
import { tagReducer } from "@/utils/tag/tag.reducer";
import { tagInput } from "@/utils/tag/tag.schema";

const STORAGE_KEY = "tags";

function initTags() {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  return [];
}

export function useTags() {
  const [tags, dispatch] = useReducer(tagReducer, [], initTags);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  }, [tags]);

  const addtag = (tag: Omit<tagInput, "id" | "date">) => {
    dispatch({
      type: "ADD_TAG",
      payload: {
        ...tag,
        id: crypto.randomUUID(),
        date: new Date(),
      },
    });
  };

  const updatetag = (id: string, data: Partial<tagInput>) => {
    dispatch({ type: "UPDATE_TAG", payload: { id, data } });
  };

  const deletetag = (id: string) => {
    dispatch({ type: "DELETE_TAG", payload: { id } });
  };

  return {
    tags,
    addtag,
    updatetag,
    deletetag,
  };
}
