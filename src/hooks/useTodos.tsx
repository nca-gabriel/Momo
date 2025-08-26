import { useEffect, useReducer } from "react";
import { todoReducer } from "@/utils/todo.reducer";
import { todoInput } from "@/utils/todo.schema";

const STORAGE_KEY = "todos";

export function useTodos() {
  const [todos, dispatch] = useReducer(todoReducer, []);

  // hydrate on client
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      dispatch({ type: "INIT_TODOS", payload: JSON.parse(raw) });
    }
  }, []);

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
