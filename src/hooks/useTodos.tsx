import { useEffect, useReducer } from "react";
import { todoReducer } from "@/utils/todo/todo.reducer";
import { todoInput } from "@/utils/todo/todo.schema";

const STORAGE_KEY = "todos";

function initTodos() {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  return [];
}

export function useTodos() {
  const [todos, dispatch] = useReducer(todoReducer, [], initTodos);

  // persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo: todoInput) => {
    dispatch({ type: "ADD_TODO", payload: todo });
  };

  const updateTodo = (id: string, data: Partial<todoInput>) => {
    dispatch({ type: "UPDATE_TODO", payload: { id, data } });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: "DELETE_TODO", payload: { id } });
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
  };
}
