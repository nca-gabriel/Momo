"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { tagForm, type TagForm, TagData, TagPatch } from "@/utils/tag.schema";
import { useTags } from "@/hooks/useTags";

type Props = {
  open: boolean;
  initValues: TagData | null;
  onClose: () => void;
  onSubmit: (data: TagForm) => void;
  onDelete: (id: string) => void;
};

export default function TagForm({
  open,
  initValues,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tagForm),
    defaultValues: initValues ?? {
      name: "",
      color: "#000000",
    },
  });

  const { addTag, updateTag, deleteTag } = useTags();

  useEffect(() => {
    if (initValues) {
      reset(initValues);
    } else {
      reset({
        name: "",
        color: "#000000",
      });
    }
  }, [initValues, reset]);

  if (!open) return null;

  const submitHandler = (data: TagForm) => {
    if (initValues) {
      updateTag.mutate({ id: initValues.id, tag: data });
    } else {
      addTag.mutate(data);
    }
    onSubmit(data);
    onClose();
    reset({
      name: "",
      color: "#000000",
    });
  };

  const handleDelete = (id: string) => {
    deleteTag.mutate(id, {
      onSuccess: () => {
        onDelete(id);
        onClose();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-2 p-1">
      <section className="flex gap-1 border rounded p-0.5">
        <div>
          <input
            type="color"
            {...register("color")}
            className="h-10 w-10 rounded-sm cursor-pointer"
          />
          {errors.color && (
            <span className="text-red-500 text-sm">{errors.color.message}</span>
          )}
        </div>
        <div>
          <input {...register("name")} className="w-full p-2" />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
      </section>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-violet-600 text-white px-4 py-1 flex-1 rounded-md cursor-pointer hover:bg-violet-800 transition-colors duration-200 delay-100"
        >
          {initValues ? "Update" : "Save"}
        </button>

        {initValues && (
          <button
            type="button"
            onClick={() => handleDelete(initValues.id)}
            className="bg-gray-300 text-gray-500 px-4 py-1 flex-1 rounded hover:bg-gray-600 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
