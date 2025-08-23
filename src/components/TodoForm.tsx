import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema, type todoInput } from "../types/todo.schema";
import { useEffect } from "react";
import type { Resolver } from "react-hook-form";

type Props = {
  initialValues: todoInput | null;
  onClose: () => void;
  onSubmit: (data: todoInput) => void;
  onDelete: (id: string) => void;
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
  } = useForm<todoInput>({
    resolver: zodResolver(todoSchema) as Resolver<todoInput>,
    defaultValues: initialValues ?? {
      title: "",
      details: "",
    },
  });

  // update form when initialValues changes
  useEffect(() => {
    reset(
      initialValues ?? {
        id: crypto.randomUUID(),
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
    reset(data); // <-- clears form after successful submit
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
        <section>
          <input
            type="datetime-local"
            {...register("date", {
              valueAsDate: true,
            })}
          />
        </section>
        <h1 className="font-bold text-lg">Subtask:</h1>
        <button>Add Subtask+</button>
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
