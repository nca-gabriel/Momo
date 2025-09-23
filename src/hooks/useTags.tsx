import { useEffect, useReducer } from "react";
import { tagReducer } from "@/utils/tag/tag.reducer";
import { tagInput } from "@/utils/tag/tag.schema";

const STORAGE_KEY = "tags";

function initTags() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    const tags = raw ? JSON.parse(raw) : [];

    if (tags.length === 0) {
      const defaultTag: tagInput = {
        id: "3fd458cc-25a7-4494-b1ba-6dcb91fdf6a0", // fixed ID
        name: "Getting Started",
        color: "#34D399",
        date: new Date(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultTag]));
      return [defaultTag];
    }

    return tags; // return existing tags properly
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
