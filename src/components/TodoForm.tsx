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
      className={`z-10 flex flex-col  ml-3 rounded bg-gray-50 shadow-lg p-4 border-e border-gray-200   max-sm:fixed max-sm:top-0 max-sm:right-0 max-sm:bottom-0 max-sm:w-60 overflow-y-auto max-sm:overflow-y-auto transition-all duration-300 ${
        open ? "w-70" : ""
      }`}
    >
      <header className="flex justify-between mb-4">
        <h1 className="font-bold text-lg">Task:</h1>
        <button
          type="button"
          onClick={onClose}
          className=" text-gray-500 hover:text-violet-600 hover:font-semibold cursor-pointer"
        >
          ✕
        </button>
      </header>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col flex-auto "
      >
        <div className="flex flex-col gap-3 min-h-50">
          <input
            {...register("title")}
            type="text"
            placeholder="Task Name"
            className="border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black"
          />

          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
          <textarea
            {...register("details")}
            placeholder="details"
            className="flex flex-1 border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black"
          />
        </div>
        <Controller
          control={control}
          name="date"
          render={({ field }) => {
            const now = new Date();
            const pad = (n: number) => String(n).padStart(2, "0");
            const minDate = `${now.getFullYear()}-${pad(
              now.getMonth() + 1
            )}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(
              now.getMinutes()
            )}`;

            return (
              <input
                type="datetime-local"
                min={minDate} // <- prevent past dates
                value={formatLocalDateTime(
                  field.value ? new Date(field.value) : undefined
                )}
                onChange={(e) => field.onChange(new Date(e.target.value))}
                className="w-full border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black my-2"
              />
            );
          }}
        />

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Tag:</label>
          <select
            {...register("tagId")}
            className="border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black"
          >
            <option
              value="00000000-0000-0000-0000-000000000000"
              className="bg-blue-200"
            >
              No tag
            </option>
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

        <h1 className="font-bold text-lg mt-2">Subtasks:</h1>
        <div className="flex justify-start border-gray-200 text-gray-500 rounded-md focus-within:text-black ">
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
            className="flex items-center gap-1 text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors cursor-pointer p-1"
          >
            <span className="text-2xl font-bold">+</span>
            <span>Add New Subtask</span>
          </button>
        </div>
        <section className="max-h-52 overflow-y-auto overflow-x-hidden">
          {subTodos.map((subTodo, index) => {
            const isEmpty = !subTodo.title.trim() && !subTodo.details.trim();

            return (
              <div
                key={subTodo.id}
                className="flex sm:flex-row gap-2 mb-2 border border-gray-200 text-gray-500 p-2 rounded-md focus-within:text-black"
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
                    className="w-5 h-5 mt-1 "
                  />
                )}

                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <input
                    {...register(`subTodos.${index}.title` as const)}
                    placeholder="Subtask title"
                    className="border border-gray-200 text-gray-500 p-1 rounded-md focus-within:text-black"
                  />
                  <input
                    {...register(`subTodos.${index}.details` as const)}
                    placeholder="Subtask details"
                    className="border border-gray-200 text-gray-500 p-1 rounded-md focus-within:text-black"
                  />
                </div>
              </div>
            );
          })}
        </section>
        <div className="flex gap-2 mt-5">
          <button
            type="submit"
            className="bg-violet-600 text-white px-4 py-1 flex-1 rounded-md cursor-pointer hover:bg-violet-800 transition-colors duration-200 delay-100"
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
              className="bg-gray-300 text-gray-500 px-4 py-1 flex-1 rounded hover:bg-gray-600 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
