import { useEffect, useReducer } from "react";
import { todoReducer } from "@/utils/todo/todo.reducer";
import { todoInput } from "@/utils/todo/todo.schema";

const STORAGE_KEY = "todos";

function initTodos() {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY);
    const todos = raw ? JSON.parse(raw) : [];

    if (todos.length === 0) {
      const defaultTodo: todoInput = {
        id: "default-todo-1", // or your ID generation logic
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
        tagId: "3fd458cc-25a7-4494-b1ba-6dcb91fdf6a0",
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultTodo]));
      return [defaultTodo];
    }

    return todos;
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
