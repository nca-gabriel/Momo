import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema, type todoInput } from "../types/todo.schema";
import { useEffect } from "react";

type Props = {
  onSubmit: (data: todoInput) => void;
  initialValues: todoInput | null;
  onDelete: () => void;
  onClose: () => void;
};

// TodoForm.tsx
export default function TodoForm({
  onSubmit,
  initialValues,
  onDelete,
  onClose,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<todoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: initialValues ?? {
      title: "",
      details: "",
    },
  });

  // update form when initialValues changes
  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const handleFormSubmit = (data: todoInput) => {
    onSubmit(data);

    reset(); // <-- clears form after successful submit
    onClose();
  };

  return (
    <div className="w-80 bg-white shadow-lg p-4 border-l">
      <h1 className="font-bold">Task</h1>
      <button
        type="button"
        onClick={onClose}
        className="relative top-2 right-2 text-gray-500 hover:text-black"
      >
        ✕
      </button>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <input {...register("title")} type="text" placeholder="Task Name" />
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
        <input {...register("details")} type="text" placeholder="details" />
        <input
          type="datetime-local"
          {...register("date", {
            valueAsDate: true,
          })}
        />

        <button type="submit" className="bg-blue-500 text-white p-1">
          {initialValues ? "Update" : "Add"}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Delete
          </button>
        )}
      </form>
      <h2>Subtask</h2>
      <button>Add Subtask+</button>
    </div>
  );
}
