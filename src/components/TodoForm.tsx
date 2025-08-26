import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema, type todoInput } from "../utils/todo.schema";
import { useEffect } from "react";
import type { Resolver } from "react-hook-form";
import { Controller } from "react-hook-form";

type Props = {
  initialValues: todoInput | null;
  onClose: () => void;
  onSubmit: (data: todoInput) => void;
  onDelete: (id: string) => void;
};

const formatDateTimeLocal = (date: Date) => {
  const d = new Date(date);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

// TodoForm.tsx
export default function TodoForm({
  initialValues,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm<todoInput>({
    resolver: zodResolver(todoSchema) as Resolver<todoInput>,
    defaultValues: initialValues ?? {
      title: "",
      details: "",
      date: new Date(),
      subTodos: [],
    },
  });

  const watchedDate = watch("date"); // subscribe to changes

  // Field array for subtodos
  const {
    fields: subTodos,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "subTodos",
  });

  // update form when initialValues changes
  useEffect(() => {
    reset(
      initialValues ?? {
        title: "",
        details: "",
        date: new Date(),
        status: false,
        subTodos: [],
      }
    );
  }, [initialValues, reset]);

  const handleFormSubmit = (data: todoInput) => {
    onSubmit(data);

    if (initialValues) {
      // update: keep form synced with updated todo
      reset(data);
      alert("updated");
    } else {
      // new todo: clear the form for next entry
      reset({
        id: crypto.randomUUID(),
        title: "",
        details: "",
        date: new Date(),
        status: false,
        subTodos: [],
      });
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg p-4 border-l">
      <header className="flex justify-between mb-4">
        <h1 className="font-bold text-lg">Task:</h1>
        <button
          type="button"
          onClick={onClose}
          className=" text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </header>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col flex-auto"
      >
        <div className="flex flex-col gap-3 min-h-50">
          <input
            {...register("title")}
            type="text"
            placeholder="Task Name"
            className="shadow-md p-2 rounded-md"
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
          <textarea
            {...register("details")}
            placeholder="details"
            className="flex flex-1 shadow-md rounded-md p-2"
          />
        </div>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <input
              type="datetime-local"
              value={
                field.value
                  ? new Date(field.value).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => field.onChange(new Date(e.target.value))}
            />
          )}
        />

        <h1 className="font-bold text-lg">Subtask:</h1>
        {subTodos.map((subTodo, index) => (
          <div key={subTodo.id} className="flex flex-col gap-2 mb-2">
            <input
              {...register(`subTodos.${index}.title` as const)}
              placeholder="Subtask title"
              className="shadow-md"
            />
            <input
              {...register(`subTodos.${index}.details` as const)}
              placeholder="Subtask details"
              className="shadow-md"
            />

            <button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-500 text-white px-2 rounded"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              title: "",
              details: "",
              status: false,
            })
          }
          className="mb-2 bg-green-500 text-white p-1 rounded"
        >
          Add Subtask+
        </button>

        <div className="flex  gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white p-1 flex-1 rounded-md"
          >
            {initialValues ? "Update" : "Add"}
          </button>
          {initialValues && (
            <button
              type="button"
              onClick={() => {
                onDelete(initialValues.id);
                onClose();
              }}
              className="bg-red-500 text-white px-4 py-1 rounded flex-1"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
