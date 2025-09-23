"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TodoData, TodoForm, todoForm } from "@/utils/todo.schema";
import { SubTodoPatch } from "@/utils/subtodo.schema";
import { TagData } from "@/utils/tag.schema";
import { useSubTodos } from "@/hooks/useTodos";

type Props = {
  open: boolean;
  initValues: TodoData | null; // 1 todo
  tags: TagData[]; // arr of tags
  onClose: () => void;
  onSubmit: (data: TodoForm) => void;
  onDelete: (id: string) => void;
};

export default function TodoForm1({
  open,
  initValues,
  tags,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(todoForm),
    defaultValues: initValues ?? {
      title: "",
      description: "",
      completed: false,
      todoDate: new Date(),
      tag: [],
      subTodos: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subTodos",
  });

  const subTodosData = watch("subTodos") ?? [];

  const { addSub, updateSub, deleteSub } = useSubTodos(initValues?.id ?? "");

  useEffect(() => {
    if (initValues) {
      reset(initValues);
    } else {
      reset({
        title: "",
        description: "",
        completed: false,
        todoDate: new Date(),
        tag: [],
        subTodos: [],
      });
    }
  }, [initValues, reset]);

  if (!open) return null;

  const submitHandler = (data: TodoForm) => {
    onSubmit({ ...data, todoDate: new Date(data.todoDate) });

    if (!initValues) {
      reset({
        title: "",
        description: "",
        completed: false,
        todoDate: new Date(),
        tag: [],
        subTodos: [],
      });
    }
  };

  const handleSubBlur = (current: SubTodoPatch, index: number) => {
    if (!current.title?.trim()) return;

    if (!initValues?.id) return; // parent todo must exist
    const todoIdSafe = initValues.id;

    if (!current.id) {
      // CREATE NEW SUBTODO
      addSub.mutate(
        {
          title: current.title,
          description: current.description ?? "",
          todoId: todoIdSafe, // link to parent
          done: current.done ?? false,
        },
        {
          onSuccess: (savedSubTodo) => {
            // Replace the temporary RHF id with the real MongoDB _id
            const updatedFields = [...fields];
            updatedFields[index] = {
              ...updatedFields[index],
              id: savedSubTodo.id,
            };
            reset({ ...watch(), subTodos: updatedFields });

            // Append a new empty subTodo input
            append({ title: "", description: "" });
          },
        }
      );
    } else {
      // UPDATE EXISTING SUBTODO
      updateSub.mutate({
        id: current.id ?? "", // must be MongoDB _id
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
      className={`z-10 flex flex-col ml-3 rounded bg-gray-50 shadow-lg p-4 border-e border-gray-200 max-sm:fixed max-sm:top-0 max-sm:right-0 max-sm:bottom-0 max-sm:w-60 overflow-y-auto transition-all duration-300 ${
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
        className="flex flex-col flex-auto gap-3"
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
        <div className="flex-1">
          <textarea
            {...register("description")}
            placeholder="Enter Description"
            className="flex flex-1 border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black"
          />
        </div>

        {/* Todo Date */}
        <div>
          <input
            type="datetime-local"
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
            {...register("tag")}
            className="border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black"
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id} className="bg-blue-200">
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* SubTodos */}
        <div>
          <h1 className="font-bold text-lg mt-2">Sub Todo:</h1>
          {fields.map((field, index) => {
            const current = subTodosData[index];

            return (
              <div key={field.id} className="flex gap-5 mb-2 items-start">
                <section>
                  <input
                    type="hidden"
                    {...register(`subTodos.${index}.id`)}
                    defaultValue={field.id ?? undefined}
                  />
                  <input
                    {...register(`subTodos.${index}.title`)}
                    placeholder="Subtodo title"
                    onBlur={() => handleSubBlur(current, index)}
                    className="border border-gray-200 p-1 rounded-md focus-within:text-black"
                  />
                  <input
                    {...register(`subTodos.${index}.description`)}
                    placeholder="Subtodo description"
                    onBlur={() => handleSubBlur(current, index)}
                    className="border border-gray-200 p-1 rounded-md focus-within:text-black"
                  />
                </section>

                <button
                  type="button"
                  onClick={() => {
                    remove(index);
                    if (current.id) deleteSub.mutate(current.id);
                  }}
                  className="text-red-500 font-bold w-5 h-5 mt-1"
                >
                  ✕
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => append({ title: "", description: "" })}
            className="flex items-center gap-1 text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors cursor-pointer p-1"
          >
            <span className="text-2xl font-bold">+</span>
            <span>Add New Subtask</span>
          </button>
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
