import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TagArr, TagForm, TagPatch } from "@/utils/tag.schema";
import axios from "axios";

export function useTags() {
  const queryClient = useQueryClient();

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/tags");
        return TagArr.parse(res.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

  const addTag = useMutation({
    mutationFn: async (tag: TagForm) => {
      const res = await axios.post("/api/tags", tag);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });

  const updateTag = useMutation({
    mutationFn: async ({ id, tag }: { id: string; tag: TagPatch }) => {
      const res = await axios.patch(`/api/tags/${id}`, tag);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });

  const deleteTag = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/tags/${id}`);
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });

  return {
    tagsQuery,
    addTag,
    updateTag,
    deleteTag,
  };
}
