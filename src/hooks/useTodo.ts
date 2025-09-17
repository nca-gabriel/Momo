import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoArrSchema, todoSchema, todoInput } from "@/utils/todo/todo.schema";
import axios from "axios";

async function fetchTodos() {
  const res = await axios.get("/api/todos");
  return res.data;
  // return todoArrSchema.parse(data);
}

async function createTodo(todo: todoInput) {
  const res = await axios.post("api/todos", todo);
  return res;
}
