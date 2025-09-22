"use client";

import {
  TodoData,
  TodoForm,
  todoForm,
  SubTodoPatch,
} from "@/utils/todo.schema";
import { TagData } from "@/utils/tag.schema";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subTodos",
  });

  if (!open) return null;

  const submitHandler = (data: TodoForm) => {
    const parsed = {
      ...data,
      todoDate: new Date(data.todoDate),
    };
    onSubmit(parsed);
    alert("updated");

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

  return (
    <main
      className={`z-10 flex flex-col  ml-3 rounded bg-gray-50 shadow-lg p-4 border-e border-gray-200   max-sm:fixed max-sm:top-0 max-sm:right-0 max-sm:bottom-0 max-sm:w-60 overflow-y-auto max-sm:overflow-y-auto transition-all duration-300 ${
        open ? "w-70" : ""
      }`}
    >
      <header className="flex justify-between mb-4">
        <h2 className="font-bold text-lg">Task</h2>
        <button
          onClick={onClose}
          className=" text-gray-500 hover:text-violet-600 hover:font-semibold cursor-pointer"
        >
          ✕
        </button>
      </header>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col flex-auto gap-3"
      >
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
        <div className="flex-1">
          <textarea
            {...register("description")}
            placeholder="Enter Description"
            className="flex flex-1 border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black"
          />
        </div>
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

        <div>
          <h1 className="font-bold text-lg mt-2">Sub Todo:</h1>
          {fields.map((field, index) => {
            const subTodosData = watch("subTodos") as SubTodoPatch[];
            const dbId = subTodosData[index]?.id;

            return (
              <div key={field.id} className="flex gap-5 ...">
                {!dbId ? (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 font-bold w-5 h-5"
                  >
                    ✕
                  </button>
                ) : (
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => {
                      if (
                        confirm(
                          `Are you sure you want to mark "${watch(
                            `subTodos.${index}.title`
                          )}" as done? This will remove it.`
                        )
                      ) {
                        remove(index);
                      }
                    }}
                    className="w-5 h-5 mt-1"
                  />
                )}

                <section>
                  <input
                    type="hidden"
                    {...register(`subTodos.${index}.id` as const)}
                    defaultValue={field.id ?? undefined}
                  />
                  <input
                    {...register(`subTodos.${index}.title` as const)}
                    placeholder="Subtodo title"
                    className="border border-gray-200 text-gray-500 p-1 rounded-md focus-within:text-black"
                  />
                  <input
                    {...register(`subTodos.${index}.description` as const)}
                    placeholder="Subtodo description"
                    className="border border-gray-200 text-gray-500 p-1 rounded-md focus-within:text-black"
                  />
                </section>
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

        <section>
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
