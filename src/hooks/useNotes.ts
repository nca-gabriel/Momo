import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { NoteArr, NoteData, NoteForm } from "@/utils/note.schema";

export default function useNotes() {
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/notes");
        return NoteArr.parse(res.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

  const addNotes = useMutation({
    mutationFn: async (note: NoteForm) => {
      const res = await axios.post("/api/notes", note);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: NoteData }) => {
      const res = await axios.patch(`/api/notes/${id}`, note);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/notes/${id}`);
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
  return {
    notesQuery,
    addNotes,
    updateNote,
    deleteNote,
  };
}
