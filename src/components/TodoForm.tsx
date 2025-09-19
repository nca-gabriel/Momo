"use client";

import { TodoData, TodoForm, todoForm } from "@/utils/todo.schema";
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
    <main>
      <header>
        <h2>Task</h2>{" "}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-violet-600"
        >
          ✕
        </button>
      </header>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div>
          <input {...register("title")} placeholder="Enter Title" />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div>
          <textarea
            {...register("description")}
            placeholder="Enter Description"
          />
        </div>
        <div>
          <input type="datetime-local" {...register("todoDate")} />
          {errors.todoDate && (
            <p className="text-red-500 text-sm">{errors.todoDate!.message}</p>
          )}
        </div>
        <div>
          <label>Tags</label>
          <select multiple {...register("tag")}>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Sub Todos</label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <input
                {...register(`subTodos.${index}.title` as const)}
                placeholder="Subtodo title"
              />
              <button type="button" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => append({ title: "" })}>
            Add Subtodo
          </button>
        </div>

        <section>
          <button type="submit">Save</button>
          {initValues && (
            <button type="button" onClick={() => onDelete(initValues!.id)}>
              Delete
            </button>
          )}
        </section>
      </form>
    </main>
  );
}
