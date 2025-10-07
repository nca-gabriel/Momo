"use client";

import { TodoData } from "@/utils/todo.schema";
import { TagData } from "@/utils/tag.schema";
import Image from "next/image";
import { useTodos, useTodo } from "@/hooks/useTodos";
import { filterTodos, DateFilter } from "@/utils/date";
import { formatTodoDate } from "@/utils/dateFormat";

type Props = {
  todos: TodoData[];
  tags: TagData[];
  filterBy: DateFilter;
  title: string;
  onOpenDrawer: (filter: DateFilter, todoId?: string) => void; // new
  editingTodoId: string | null; // new
};

export default function Todos({
  todos,
  tags,
  filterBy,
  title,
  onOpenDrawer,
  editingTodoId,
}: Props) {
  const { data: editingTodo } = useTodo(editingTodoId ?? "");
  const { addMutation, updateMutation, deleteMutation } = useTodos();

  const filteredTodos = filterTodos(filterBy, todos);

  return (
    <div className="flex-1">
      <header>
        <h1 className="text-4xl font-semibold">{title}</h1>
      </header>

      <div className="flex justify-end">
        <button
          onClick={() => onOpenDrawer(filterBy)}
          className="flex items-center gap-1 text-gray-700 text-sm font-medium hover:text-violet-600 transition-colors cursor-pointer"
        >
          <span className="text-lg">+</span>
          <span>Add</span>
        </button>
      </div>

      <ul className="gap-2">
        {filteredTodos.length === 0 ? (
          <li className="p-2 text-gray-500">No tasks yet</li>
        ) : (
          filteredTodos.map((todo) => {
            const todoTag = tags.find((tag) => tag.id === todo.tagId);

            return (
              <li
                key={todo.id}
                className={`border-b border-gray-200 p-2 cursor-pointer ${
                  todo.completed ? "opacity-50" : ""
                }`}
                onClick={() => onOpenDrawer(filterBy, todo.id)}
              >
                <section className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-violet-600"
                      checked={todo.completed || false}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateMutation.mutate({
                          id: todo.id,
                          todo: { completed: e.target.checked },
                        })
                      }
                    />
                    <h2
                      className={`font-bold ${
                        todo.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.title}
                    </h2>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDrawer(filterBy, todo.id);
                    }}
                  >
                    <Image
                      src="/arrow.png"
                      alt="arrow"
                      width={15}
                      height={15}
                      unoptimized
                    />
                  </button>
                </section>

                <section className="flex flex-wrap gap-5 ml-5">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/calendar.png"
                      alt="calendar"
                      width={18}
                      height={18}
                      unoptimized
                    />
                    {formatTodoDate(new Date(todo.todoDate), filterBy)}
                  </div>

                  {todo.subTodos?.length > 0 && (
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>Subtasks:</span>
                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-2xl font-medium">
                        <svg
                          className="w-3 h-3 text-violet-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 111.414-1.414L9 11.586l6.543-6.543a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {todo.subTodos.filter((sub) => sub.done).length} /{" "}
                        {todo.subTodos.length}
                      </span>
                    </div>
                  )}

                  {todoTag && (
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-5 h-5 rounded-sm"
                        style={{ backgroundColor: todoTag.color }}
                      />
                      <span>{todoTag.name}</span>
                    </div>
                  )}
                </section>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
