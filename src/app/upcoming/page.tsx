import { prisma } from "@/utils/prisma";
import { TodoDataArr } from "@/utils/todo.schema";
import UpcomingClient from "./UpcomingClient";

export default async function Page() {
  const todos = await prisma.todo.findMany({
    include: { subTodos: true, tag: true },
  });

  // validate from db
  const parsed = TodoDataArr.parse(todos);

  const tags = await prisma.tag.findMany();

  return <UpcomingClient initialTodos={parsed} initialTags={tags} />;
}
