"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTodos } from "@/hooks/useTodos";
import { useTags } from "@/hooks/useTags";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const { todosQuery } = useTodos();
  const { tagsQuery } = useTags();

  const todos = todosQuery.data ?? [];
  const tags = tagsQuery.data ?? [];

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const endOfWeek = useMemo(() => {
    const d = new Date(today);
    d.setDate(today.getDate() + 7);
    return d;
  }, [today]);

  const getTodoCountForRoute = (href: string) => {
    return todos.filter((t) => {
      if (!t.createdAt) return false;
      const todoDate = new Date(t.createdAt);
      todoDate.setHours(0, 0, 0, 0);

      switch (href) {
        case "/":
          return todoDate.getTime() === today.getTime();
        case "/upcoming":
          return (
            todoDate.getTime() >= today.getTime() &&
            todoDate.getTime() <= endOfWeek.getTime()
          );
        case "/notes":
          return false;
        default:
          return true;
      }
    }).length;
  };

  const navItems = [
    { href: "/", label: "Today" },
    { href: "/upcoming", label: "Upcoming" },
    { href: "/calendar", label: "Calendar" },
    { href: "/notes", label: "Notes" },
  ];

  return (
    <div
      className={`h-screen border-r border-gray-100 transition-all duration-300 shrink-0 flex flex-col ${
        collapsed ? "w-16 max-sm:w-11" : "w-72 bg-gray-50"
      }`}
    >
      {/* Header */}
      <section className="flex items-center justify-between p-4">
        {!collapsed && <p className="font-bold">Menu</p>}
        <button onClick={() => setCollapsed((prev) => !prev)}>
          <Image src="/burger.svg" alt="burger-icon" width={24} height={24} />
        </button>
      </section>

      <div className="flex-1 overflow-y-auto">
        {/* Nav */}
        <nav className="flex-1">
          {!collapsed && (
            <p className="px-4 text-xs font-semibold text-gray-500">TASKS</p>
          )}
          <ul className="mt-2 space-y-1">
            {navItems.map(({ href, label }) => {
              const count = getTodoCountForRoute(href);
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex justify-between items-center rounded-lg px-4 py-2 text-sm font-medium ${
                      active
                        ? "bg-gray-200 text-gray-700 font-semibold"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    <span className={`${collapsed && "hidden"}`}>{label}</span>
                    {count > 0 && !collapsed && (
                      <span
                        className={`text-center w-6 font-semibold rounded ${
                          active ? "bg-white" : "bg-gray-200"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tags */}
        {!collapsed && (
          <section className="px-4 py-6">
            <p className="text-xs font-semibold text-gray-500">TAGS</p>
            <ul className="mt-2 space-y-1">
              {tags.map((tag) => (
                <li key={tag.id}>
                  <Link
                    href={`/tags/${tag.id}`}
                    className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    <span
                      className="w-5 h-5 rounded-sm"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{tag.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-gray-200 p-4 flex items-center gap-2">
          <Image
            alt="Profile"
            src="/pfp.png"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">Neil Christian A. Gabriel</p>
            <p className="text-xs text-gray-500">ncagabriel02@gmail.com</p>
          </div>
        </div>
      )}
    </div>
  );
}
