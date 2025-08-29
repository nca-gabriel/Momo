import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listSchema, type listInput } from "../utils/list.schema";

type Props = {
  initialValues: listInput | null;
  onClose: () => void;
};

export default function ListForm({ initialValues, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(listSchema),
    defaultValues: initialValues ?? {
      name: "",
      color: "",
    },
  });
  return <div>ListForm</div>;
}
