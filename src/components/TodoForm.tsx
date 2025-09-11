import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema, type todoInput } from "../utils/todo/todo.schema";
import { useEffect } from "react";
import type { Resolver } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTagContext } from "@/context/AppProvider";

type Props = {
  open: boolean;
  initialValues: todoInput | null;
  onClose: () => void;
  onSubmit: (data: todoInput) => void;
  onDelete: (id: string) => void;
};

// TodoForm.tsx
export default function TodoForm({
  open,
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
    control,
  } = useForm<todoInput>({
    resolver: zodResolver(todoSchema) as Resolver<todoInput>,
    defaultValues: initialValues ?? {
      title: "",
      details: "",
      date: new Date(),
      subTodos: [],
      tagId: undefined,
    },
  });

  // Field array for subtodos
  const {
    fields: subTodos,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "subTodos",
  });

  const { tags } = useTagContext();

  // update form when initialValues changes
  useEffect(() => {
    reset(
      initialValues ?? {
        title: "",
        details: "",
        date: new Date(),
        status: false,
        tagId: undefined,
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
        tagId: undefined,
      });
    }
  };

  const formatLocalDateTime = (date?: Date) => {
    if (!date) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  return (
    <div
      className={`z-10  ml-3 rounded bg-gray-50 shadow-lg p-4 border-e border-gray-200   max-sm:fixed max-sm:top-0 max-sm:right-0 max-sm:bottom-0 max-sm:w-60 overflow-y-auto max-sm:overflow-y-auto transition-all duration-300 ${
        open ? "w-70" : ""
      }`}
    >
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
              value={formatLocalDateTime(
                field.value ? new Date(field.value) : undefined
              )}
              onChange={(e) => field.onChange(new Date(e.target.value))}
              className="w-full rounded-md  p-2 shadow-md focus:border-blue-500 focus:ring focus:ring-blue-200 my-2"
            />
          )}
        />

        <div className="flex flex-col gap-2">
          <label className="font-semibold">tag:</label>
          <select {...register("tagId")} className="shadow-md p-2 rounded-md">
            <option value="00000000-0000-0000-0000-000000000000">No tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          {errors.tagId && (
            <span className="text-red-500">{errors.tagId.message}</span>
          )}
        </div>

        <h1 className="font-bold text-lg">Subtasks:</h1>
        {subTodos.map((subTodo, index) => {
          const isEmpty = !subTodo.title.trim() && !subTodo.details.trim();

          return (
            <div
              key={subTodo.id}
              className=" flex flex-col sm:flex-row gap-2 mb-2 p-1 rounded shadow-sm"
            >
              {isEmpty ? (
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
                  checked={subTodo.status}
                  onChange={() => {
                    if (
                      confirm(
                        `Are you sure you want to mark "${subTodo.title}" as done? This will remove it.`
                      )
                    ) {
                      remove(index);
                    }
                  }}
                  className="w-5 h-5 mt-1"
                />
              )}

              <div className="flex-1 flex flex-col">
                <input
                  {...register(`subTodos.${index}.title` as const)}
                  placeholder="Subtask title"
                  className="shadow-md p-1 rounded"
                />
                <input
                  {...register(`subTodos.${index}.details` as const)}
                  placeholder="Subtask details"
                  className="shadow-md p-1 rounded mt-1"
                />
              </div>
            </div>
          );
        })}
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
          Add Subtask +
        </button>

        <div className="flex  gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white p-1 flex-1 rounded-md"
          >
            {initialValues && !("isNew" in initialValues) ? "Update" : "Add"}
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
