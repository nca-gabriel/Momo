import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TagArr, TagForm, TagPatch } from "@/utils/tag.schema";
import axios from "axios";

export function useTags() {
  const queryClient = useQueryClient();

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/todos");
        return TagArr.parse(res.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
  return {};
}
