import { useEffect, useState } from "react";

// schema
export interface Todo {
  id: string;
  title: string;
  description: string;
  status: false;
  tags: string;
  dateTime: Date;
}

function useTodos() {
  return <div>useTodos</div>;
}

export default useTodos;
