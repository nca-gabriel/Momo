import { useEffect, useReducer } from "react";
import { todoReducer } from "@/utils/todo/todo.reducer";
import { todoInput } from "@/utils/todo/todo.schema";

const STORAGE_KEY = "todos";

export function useTodos() {
  const [todos, dispatch] = useReducer(todoReducer, []);

  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    let storedTodos: todoInput[] = raw ? JSON.parse(raw) : [];

    if (storedTodos.length === 0) {
      const defaultTodo: todoInput = {
        id: crypto.randomUUID(),
        title: "Welcome! 👋",
        details: "This is a default todo to get you started.",
        status: false,
        date: new Date(),
        subTodos: [
          {
            id: crypto.randomUUID(),
            title: "This is a subtask",
            details: "details about this subtask",
            status: false,
          },
        ],
        tagId: "3fd458cc-25a7-4494-b1ba-6dcb91fdf6a0", // fixed tag ID
      };
      storedTodos = [defaultTodo];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedTodos));
    }

    dispatch({ type: "INIT_TODOS", payload: storedTodos });
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

  const sortedTodos = [...todos].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return {
    todos: sortedTodos,
    addTodo,
    updateTodo,
    deleteTodo,
  };
}
