import { useEffect, useReducer } from "react";
import { todoReducer } from "@/types/todo.reducer";
import { subTodoInput, todoInput } from "@/types/todo.schema";

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

  const addSubTodo = (todoId: string, subTodo: subTodoInput) => {
    dispatch({ type: "ADD_SUBTODO", payload: { todoId, subTodo } });
  };

  const updateSubTodo = (
    todoId: string,
    subTodoId: string,
    subTodo: Partial<subTodoInput>
  ) => {
    dispatch({
      type: "UPDATE_SUBTODO",
      payload: { todoId, subTodoId, subTodo },
    });
  };

  const deleteSubTodo = (todoId: string, subTodoId: string) => {
    dispatch({ type: "DELETE_SUBTODO", payload: { todoId, subTodoId } });
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    addSubTodo,
    updateSubTodo,
    deleteSubTodo,
  };
}
