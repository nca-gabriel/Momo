// "use client";

// import React, { useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { EventSourceInput } from "@fullcalendar/core";
// import TodoForm from "@/components/TodoForm";
// import { useTodoContext, useTagContext } from "@/context/AppProvider";
// import { todoInput } from "@/utils/todo.schema";

// export default function Upcoming() {
//   const { todos, addTodo, updateTodo, deleteTodo } = useTodoContext();
//   const { tags } = useTagContext();
//   const [drawer, setDrawer] = useState(false);
//   const [editingTodo, setEditingTodo] = useState<todoInput | null>(null);

//   return (
//     <div className="flex-1 flex p-1">
//       <div className=" w-full bg-white rounded-2xl shadow-md px-8 py-4">
//         <div className="w-full">
//           <FullCalendar
//             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//             initialView="timeGridWeek"
//             headerToolbar={{
//               left: "prev,next today",
//               center: "title",
//               right: "timeGridDay,timeGridWeek,dayGridMonth",
//             }}
//             height="auto"
//             events={
//               todos.map((t) => {
//                 const tag = tags.find((tag) => tag.id === t.tagId);
//                 return {
//                   id: t.id,
//                   title: t.title,
//                   start: t.date,
//                   backgroundColor: tag?.color || "#3b82f6",
//                   borderColor: tag?.color || "#7c3aed",
//                 };
//               }) as EventSourceInput
//             }
//             nowIndicator={true}
//             editable={true}
//             droppable={true}
//             selectable={true}
//             selectMirror={true}
//             allDaySlot={false}
//             dateClick={(arg) => {
//               setEditingTodo({
//                 id: crypto.randomUUID(),
//                 title: "",
//                 details: "",
//                 date: new Date(arg.date),
//                 status: false,
//                 subTodos: [],
//                 tagId: "00000000-0000-0000-0000-000000000000",
//                 isNew: true,
//               } as todoInput & { isNew?: boolean });
//               setDrawer(true);
//             }}
//             eventClick={(info) => {
//               const todo = todos.find((t) => t.id === info.event.id);
//               if (todo) {
//                 setEditingTodo(todo);
//                 setDrawer(true);
//               }
//             }}
//             eventDrop={(info) => {
//               const todo = todos.find((t) => t.id === info.event.id);
//               if (todo) {
//                 updateTodo(todo.id, { ...todo, date: info.event.start! });
//               }
//             }}
//           />
//         </div>
//       </div>

//       {drawer && editingTodo && (
//         <TodoForm
//           open={drawer}
//           initialValues={editingTodo}
//           onClose={() => {
//             setEditingTodo(null);
//             setDrawer(false);
//           }}
//           onSubmit={(data) => {
//             // check if this todo is already in the state
//             const exists = todos.some((t) => t.id === editingTodo?.id);

//             if (exists && editingTodo) {
//               updateTodo(editingTodo.id, data);
//             } else {
//               addTodo({ ...data, id: editingTodo?.id || crypto.randomUUID() });
//             }

//             setDrawer(false);
//           }}
//           onDelete={(id) => {
//             deleteTodo(id);
//             setDrawer(false);
//           }}
//         />
//       )}
//     </div>
//   );
// }
