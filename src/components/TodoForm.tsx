"use client";

import { useEffect, useRef, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TodoData, TodoForm, todoForm } from "@/utils/todo.schema";
import { SubTodoPatch } from "@/utils/subtodo.schema";
import { TagData } from "@/utils/tag.schema";
import { useSubTodos } from "@/hooks/useTodos";
import { localISOTime, toLocalDatetimeInput } from "@/utils/dateFormat";
import { DateFilter, getDefaultDate } from "@/utils/date";

type Props = {
  open: boolean;
  initValues: TodoData | null;
  tags: TagData[];
  filterBy: DateFilter;
  defaultDate?: Date;
  onClose: () => void;
  onSubmit: (data: TodoForm) => void;
  onDelete: (id: string) => void;
};

export default function TodoForm1({
  open,
  initValues,
  tags,
  filterBy,
  defaultDate,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const fallbackDate = useMemo(
    () => defaultDate ?? getDefaultDate(filterBy),
    [defaultDate, filterBy]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(todoForm),
    defaultValues: useMemo(() => {
      if (initValues) {
        return {
          ...initValues,
          todoDate: toLocalDatetimeInput(new Date(initValues.todoDate)),
        };
      }
      return {
        title: "",
        description: "",
        completed: false,
        todoDate: toLocalDatetimeInput(fallbackDate),
        tagId: "",
        subTodos: [],
      };
    }, [initValues, fallbackDate]),
  });

  const { fields, prepend, remove, update } = useFieldArray({
    control,
    name: "subTodos",
  });

  const subTodosData = watch("subTodos") ?? [];
  const { addSub, updateSub } = useSubTodos(initValues?.id ?? "");

  const prevTodoId = useRef<string | null>(null);

  useEffect(() => {
    if (initValues?.id !== prevTodoId.current) {
      prevTodoId.current = initValues?.id ?? null;
      reset(
        initValues
          ? {
              ...initValues,
              todoDate: toLocalDatetimeInput(new Date(initValues.todoDate)),
            }
          : {
              title: "",
              description: "",
              completed: false,
              todoDate: toLocalDatetimeInput(fallbackDate),
              tagId: "",
              subTodos: [],
            }
      );
    }
  }, [initValues, fallbackDate, reset]);

  if (!open) return null;

  const submitHandler = (data: TodoForm) => {
    onSubmit({ ...data, todoDate: new Date(data.todoDate) });
    if (!initValues)
      reset({
        title: "",
        description: "",
        completed: false,
        todoDate: toLocalDatetimeInput(fallbackDate),
        tagId: "",
        subTodos: [],
      });
  };

  const handleSubBlur = (current: SubTodoPatch, index: number) => {
    if (!initValues?.id) return;

    if (!current.id) {
      addSub.mutate(
        {
          title: current.title,
          description: current.description ?? "",
          todoId: initValues!.id,
          done: current.done ?? false,
        },
        {
          onSuccess: (savedSubTodo) => {
            // Update the specific field using FieldArray's update
            update(index, { ...subTodosData[index], ...savedSubTodo });
          },
        }
      );
    } else {
      // PATCH
      updateSub.mutate({
        id: current.id,
        subTodo: {
          title: current.title,
          description: current.description ?? "",
          done: current.done ?? false,
        },
      });
    }
  };

  return (
    <main
      className={`z-10 flex flex-col ml-3 rounded bg-gray-50 shadow-lg p-4 border-e border-gray-200 max-sm:fixed max-sm:top-0 max-sm:right-0 max-sm:bottom-0 max-sm:w-60 transition-all duration-300 ${
        open ? "w-70" : ""
      }`}
    >
      <header className="flex justify-between mb-4">
        <h2 className="font-bold text-lg">Task</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-violet-600 hover:font-semibold cursor-pointer"
        >
          ✕
        </button>
      </header>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-3"
      >
        {/* Title */}
        <div className="flex flex-col">
          <input
            {...register("title")}
            placeholder="Enter Title"
            className="border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            {...register("description")}
            placeholder="Enter Description"
            className="border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black w-full"
          />
        </div>

        {/* Todo Date */}
        <div>
          <input
            type="datetime-local"
            min={localISOTime}
            {...register("todoDate")}
            className="w-full border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black my-2"
          />
          {errors.todoDate && (
            <p className="text-red-500 text-sm">{errors.todoDate!.message}</p>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <label>Tags</label>
          <select
            {...register("tagId")}
            className="border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black"
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* SubTodos */}
        <div className="flex flex-col w-full">
          <h1 className="font-bold text-lg mt-2">Subtask:</h1>
          <div className="flex justify-start mb-2">
            <button
              type="button"
              onClick={() =>
                prepend({ title: "", description: "", done: false })
              }
              className="flex items-center gap-1 text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors cursor-pointer p-1"
            >
              <span className="text-2xl font-bold">+</span>
              <span>Add New Subtask</span>
            </button>
          </div>
          <section className="max-h-52 overflow-y-auto overflow-x-hidden flex flex-col gap-2">
            {fields.map((field, index) => {
              const current = subTodosData[index];
              const isNew = !current.id;
              return (
                <div
                  key={field.id}
                  className={`flex sm:flex-row gap-2 mb-2 border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black ${
                    current.done ? "opacity-50" : ""
                  }`}
                >
                  {isNew ? (
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        remove(index);
                      }}
                      className="text-red-500 font-bold w-5 h-5 mt-1"
                    >
                      ✕
                    </button>
                  ) : (
                    <input
                      type="checkbox"
                      checked={current.done}
                      onChange={() => {
                        const newDone = !current.done;
                        update(index, { ...current, done: newDone });
                        updateSub.mutate({
                          id: current.id!,
                          subTodo: { ...current, done: newDone },
                        });
                      }}
                      className="w-5 h-5 mt-1 cursor-pointer accent-violet-600"
                    />
                  )}

                  <div
                    className={`flex-1 flex flex-col gap-1 min-w-0 ${
                      current.done ? "line-through text-gray-400" : ""
                    }`}
                    tabIndex={-1}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        handleSubBlur(current, index);
                      }
                    }}
                  >
                    <input
                      {...register(`subTodos.${index}.title`)}
                      placeholder="Subtodo title"
                      className="border border-gray-200 text-gray-500 p-1 rounded-md focus-within:text-black w-full"
                    />
                    <input
                      {...register(`subTodos.${index}.description`)}
                      placeholder="Subtodo description"
                      className="border border-gray-200 text-gray-500 p-1 rounded-md focus-within:text-black w-full"
                    />
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        {/* Submit / Delete */}
        <section className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-violet-600 text-white px-4 py-1 flex-1 rounded-md cursor-pointer hover:bg-violet-800 transition-colors duration-200 delay-100"
          >
            Save
          </button>
          {initValues && (
            <button
              type="button"
              onClick={() => onDelete(initValues!.id)}
              className="bg-gray-300 text-gray-500 px-4 py-1 flex-1 rounded hover:bg-gray-600 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Delete
            </button>
          )}
        </section>
      </form>
    </main>
  );
}
