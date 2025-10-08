import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { NoteArr, NoteData, NoteForm } from "@/utils/note.schema";
import { toast } from "react-hot-toast";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note added");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to add note");
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: NoteData }) => {
      const res = await axios.patch(`/api/notes/${id}`, note);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note updated");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update note");
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/notes/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete note");
    },
  });
  return {
    notesQuery,
    addNotes,
    updateNote,
    deleteNote,
  };
}
