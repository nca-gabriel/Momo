import { useEffect, useReducer } from "react";
import { Todo, TodoInput, TodoUpdate } from "@/types/todo";

// --- Reducer + actions ---
type Action =
  | { type: "load"; payload: Todo[] }
  | { type: "add"; payload: TodoInput }
  | { type: "update"; id: string; payload: TodoUpdate }
  | { type: "delete"; id: string };

function todosReducer(state: Todo[], action: Action) {
  switch (action.type) {
    case "load":
      return action.payload;
    case "add":
      return [...state, { ...action.payload, id: crypto.randomUUID() }];
    case "update":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, ...action.payload } : todo
      );
    case "delete":
      return state.filter((todo) => todo.id !== action.id);
    default:
      return state;
  }
}

function useTodos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  //  // initial load
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      const parsed: Todo[] = JSON.parse(stored).map((t: any) => ({
        ...t,
        dateTime: new Date(t.dateTime),
      }));
      dispatch({ type: "load", payload: parsed });
    }
  }, []);

  // sync to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo: TodoInput) => dispatch({ type: "add", payload: todo });
  const updateTodo = (id: string, updates: TodoUpdate) =>
    dispatch({ type: "update", id, payload: updates });
  const deleteTodo = (id: string) => dispatch({ type: "delete", id });

  return { todos, addTodo, updateTodo, deleteTodo };
}

export default useTodos;
