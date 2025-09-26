import { TodoData } from "@/utils/todo.schema";

export const formatForForm = (values: TodoData | null) => {
  const toLocalString = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

  if (!values) {
    return {
      title: "",
      description: "",
      completed: false,
      todoDate: toLocalString(new Date()), // string
      tagId: "",
      subTodos: [],
    };
  }

  return {
    ...values,
    todoDate: toLocalString(values.todoDate), // ensure string
  };
};
