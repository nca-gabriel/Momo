import { prisma } from "@/lib/prisma";
import { NoteArr } from "@/utils/note.schema";
import NoteClient from "./NoteClient";

export default async function page() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });
  const parsed = NoteArr.parse(notes);

  return <NoteClient initialNotes={parsed} />;
}
