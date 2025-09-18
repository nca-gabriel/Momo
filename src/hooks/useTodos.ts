import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TodoDataArr, TodoForm, TodoPatch } from "@/utils/todo.schema";
import axios from "axios";

export function useTodos() {
  const queryClient = useQueryClient();

  // fetch initial
  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/todos");
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, todo }: { id: string; todo: TodoPatch }) => {
      const res = await axios.patch(`/api/todos/${id}`, todo);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/todos/${id}`);
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return {
    todosQuery, // contains data, isLoading, isError
    addMutation, // mutate function: addMutation.mutate(todoForm)
    updateMutation, // mutate function: updateMutation.mutate({id, todo})
    deleteMutation, // mutate function: deleteMutation.mutate(id)
  };
}
