import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useEffect } from "react";

import { tagSchema, type tagInput } from "../utils/tag.schema";
import { useTagContext } from "@/context/AppProvider";

type Props = {
  initialValues: tagInput | null;
  onClose: () => void;
};

type TagFormData = Omit<tagInput, "id" | "date">;

export default function TagForm({ initialValues, onClose }: Props) {
  const { addtag, updatetag, deletetag } = useTagContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TagFormData>({
    resolver: zodResolver(
      tagSchema.omit({ id: true, date: true })
    ) as Resolver<TagFormData>,
    defaultValues: initialValues ?? {
      name: "",
      color: "#000000",
    },
  });

  // reset form when editing
  useEffect(() => {
    reset(initialValues ?? { name: "", color: "#000000" });
  }, [initialValues, reset]);

  const handleFormSubmit = (data: TagFormData) => {
    if (initialValues) {
      updatetag(initialValues.id, data);
      reset(data); // keep synced
    } else {
      addtag(data); // ✅ id + date handled in hook
      reset({ name: "", color: "#000000" });
    }
    onClose();
  };

  const handleDelete = () => {
    if (initialValues) {
      deletetag(initialValues.id);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2 p-1">
      <section className="flex gap-1 border rounded p-0.5">
        <input
          type="color"
          {...register("color")}
          className="h-10 w-10 rounded-sm cursor-pointer"
        />
        {errors.color && (
          <p className="text-red-500 text-sm">{errors.color.message}</p>
        )}
        <input
          {...register("name")}
          placeholder="tag Name"
          className="w-full p-2  "
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </section>

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
