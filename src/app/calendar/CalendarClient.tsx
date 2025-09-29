"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventSourceInput } from "@fullcalendar/core";

import { useTodos, useTodo } from "@/hooks/useTodos";
import { useTags } from "@/hooks/useTags";
import TodoForm from "@/components/TodoForm";
import { TodoData } from "@/utils/todo.schema";
import { TagData } from "@/utils/tag.schema";
import { DateFilter } from "@/utils/date";

type Props = {
  initialTodos: TodoData[];
  initialTags: TagData[];
};

export default function CalendarClient({ initialTodos, initialTags }: Props) {
  const { todosQuery, addMutation, updateMutation, deleteMutation } =
    useTodos();
  const { tagsQuery } = useTags();

  const todos = todosQuery.data ?? initialTodos;
  const tags = tagsQuery.data ?? initialTags;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);
  const [currentFilter, setCurrentFilter] = useState<DateFilter>("today");

  const editingTodo = useTodo(editingTodoId ?? "").data;

  const openDrawer = (todoId?: string, date?: Date) => {
    setEditingTodoId(todoId ?? null);
    setCalendarDate(date ?? null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setEditingTodoId(null);
    setCalendarDate(null);
    setDrawerOpen(false);
  };

  const events: EventSourceInput = todos.map((t) => {
    const tag = tags.find((tag) => tag.id === t.tagId);
    return {
      id: t.id,
      title: t.title,
      start: t.todoDate,
      backgroundColor: tag?.color || "#3b82f6",
      borderColor: tag?.color || "#7c3aed",
    };
  });

  return (
    <div className="flex relative">
      <main className="flex-1 p-2">
        <header className="mb-6">
          <h1 className="text-4xl font-semibold">Upcoming</h1>
        </header>

        <div className="w-full bg-white rounded-2xl shadow-md p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridDay,timeGridWeek,dayGridMonth",
            }}
            height="auto"
            nowIndicator
            editable
            droppable
            selectable
            selectMirror
            allDaySlot={false}
            events={events}
            dateClick={(arg) => {
              // Open drawer for new todo on clicked date
              openDrawer(undefined, arg.date);
            }}
            eventClick={(info) => {
              // Open drawer for existing todo
              openDrawer(info.event.id, info.event.start ?? undefined);
            }}
            eventDrop={(info) => {
              const todo = todos.find((t) => t.id === info.event.id);
              if (todo) {
                updateMutation.mutate({
                  id: todo.id,
                  todo: { ...todo, todoDate: info.event.start! },
                });
              }
            }}
          />
        </div>
      </main>

      {drawerOpen && (
        <div className="flex-none">
          <TodoForm
            open={drawerOpen}
            initValues={editingTodo ?? null}
            tags={tags}
            filterBy={currentFilter} // fallback filter
            defaultDate={calendarDate ?? undefined} // clicked date
            onClose={closeDrawer}
            onSubmit={(data) => {
              if (editingTodo) {
                updateMutation.mutate({ id: editingTodo.id, todo: data });
              } else {
                addMutation.mutate(data);
              }
            }}
            onDelete={(id) => {
              deleteMutation.mutate(id, { onSuccess: closeDrawer });
            }}
          />
        </div>
      )}
    </div>
  );
}
