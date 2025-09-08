"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useEffect } from "react";

import { listSchema, type listInput } from "../utils/list/list.schema";
import { useListContext } from "@/context/AppProvider";

type Props = {
  initialValues: listInput | null;
  onClose: () => void;
};

type ListFormData = Omit<listInput, "id" | "date">;

export default function ListForm({ initialValues, onClose }: Props) {
  const { addList, updateList, deleteList } = useListContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ListFormData>({
    resolver: zodResolver(
      listSchema.omit({ id: true, date: true })
    ) as Resolver<ListFormData>,
    defaultValues: initialValues ?? {
      name: "",
      color: "#000000",
    },
  });

  // reset form when editing
  useEffect(() => {
    reset(initialValues ?? { name: "", color: "#000000" });
  }, [initialValues, reset]);

  const handleFormSubmit = (data: ListFormData) => {
    if (initialValues) {
      updateList(initialValues.id, data);
      reset(data); // keep synced
    } else {
      addList(data); // ✅ id + date handled in hook
      reset({ name: "", color: "#000000" });
    }
    onClose();
  };

  const handleDelete = () => {
    if (initialValues) {
      deleteList(initialValues.id);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2">
      <input
        {...register("name")}
        placeholder="List Name"
        className="w-full p-2 border rounded"
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}

      <input
        type="color"
        {...register("color")}
        className="w-full h-10 p-1 border rounded"
      />
      {errors.color && (
        <p className="text-red-500 text-sm">{errors.color.message}</p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {initialValues ? "Update" : "Save"}
        </button>

        {initialValues && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
