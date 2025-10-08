import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TodoDataArr,
  TodoForm,
  TodoPatch,
  todoData,
} from "@/utils/todo.schema";

import { SubTodoData, SubTodoForm, SubTodoPatch } from "@/utils/subtodo.schema";
import axios from "axios";
import { toast } from "react-hot-toast";

export function useTodos(tagId?: string) {
  const queryClient = useQueryClient();

  // fetch initial
  const todosQuery = useQuery({
    queryKey: ["todos", tagId],
    queryFn: async () => {
      try {
        const url = tagId ? `/api/tags/${tagId}/todos` : `/api/todos`;
        const res = await axios.get(url);
        return TodoDataArr.parse(res.data);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async (todo: TodoForm) => {
      const res = await axios.post("/api/todos", todo);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo added");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to add todo");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, todo }: { id: string; todo: TodoPatch }) => {
      const res = await axios.patch(`/api/todos/${id}`, todo);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo updated");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update todo");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/todos/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo deleted");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete todo");
    },
  });

  return {
    todosQuery, // contains data, isLoading, isError
    addMutation, // mutate function: addMutation.mutate(todoForm)
    updateMutation, // mutate function: updateMutation.mutate({id, todo})
    deleteMutation, // mutate function: deleteMutation.mutate(id)
  };
}

export function useTodo(todoId: string) {
  return useQuery({
    queryKey: ["todo", todoId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/todos/${todoId}`);
      return todoData.parse(data);
    },
    enabled: !!todoId,
  });
}

export function useSubTodos(todoId: string) {
  const queryClient = useQueryClient();

  const addSub = useMutation({
    mutationFn: async (subTodo: SubTodoForm & { todoId: string }) => {
      const res = await axios.post(`/api/subtodos`, { ...subTodo, todoId });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const updateSub = useMutation({
    mutationFn: async ({
      id,
      subTodo,
    }: {
      id: string;
      subTodo: SubTodoPatch;
    }) => {
      const res = await axios.patch(`/api/subtodos/${id}`, subTodo);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
    },
  });

  const deleteSub = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/subtodos/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
    },
  });

  return { addSub, updateSub, deleteSub };
}
