// TodoForm.tsx
export default function TodoForm() {
  return (
    <div className="w-80 bg-white shadow-lg p-4 border-l">
      <h1 className="font-bold">Task</h1>
      <form action="">
        <input type="text" placeholder="Task Name" />
        <input type="text" placeholder="Tags" />
        <input type="datetime-local" />

        <button>Delete Task</button>
        <button>Update Task</button>
      </form>
    </div>
  );
}
