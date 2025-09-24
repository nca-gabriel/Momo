"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTagContext, useTodoContext } from "@/context/AppProvider";
import TagForm from "./TagForm";
import { tagInput } from "@/utils/tag/tag.schema";

// lucide-react icons
import { Calendar, FileText, ListTodo, Clock } from "lucide-react";

const STORAGE_KEY = "sidebar-collapsed";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [opentag, setOpentag] = useState(false);
  const pathname = usePathname();
  const { tags } = useTagContext();
  const [editingtag, setEditingtag] = useState<tagInput | null>(null);
  const { todos } = useTodoContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        setCollapsed(JSON.parse(raw));
      }
    }
  }, []);

  // Save state when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    }
  }, [collapsed]);

  const navItems = [
    { href: "/", label: "Today", icon: ListTodo },
    { href: "/upcoming", label: "Upcoming", icon: Clock },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/notes", label: "Notes", icon: FileText },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const getTodoCountForRoute = (href: string) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const endOfWeek = new Date();
    endOfWeek.setDate(today.getDate() + 7);

    switch (href) {
      case "/":
        return todos.filter(
          (t) => new Date(t.date).toDateString() === today.toDateString()
        ).length;
      case "/upcoming":
        return todos.filter((t) => {
          const d = new Date(t.date);
          return (
            d.toDateString() === today.toDateString() ||
            d.toDateString() === tomorrow.toDateString() ||
            (d > tomorrow && d <= endOfWeek)
          );
        }).length;
      case "/notes":
        return 0;
      default:
        return todos.length;
    }
  };

  return (
    <div
      className={`h-screen transition-all duration-300 ${
        collapsed ? "w-24 max-sm:w-16" : "w-72 bg-gray-50"
      } shrink-0 flex flex-col`}
    >
      {/* Header */}
      <section
        className={`flex items-center p-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && <p className="font-bold">Menu</p>}
        <button onClick={() => setCollapsed(!collapsed)}>
          <Image src="/burger.svg" alt="burger-icon" width={24} height={24} />
        </button>
      </section>

      {/* Expanded */}
      {!collapsed ? (
        <>
          <div className="flex-1 overflow-y-auto">
            {/* Nav */}
            <nav className="flex-1">
              <p className="px-4 text-xs font-semibold text-gray-500">TASKS</p>
              <ul className="mt-2 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const count = getTodoCountForRoute(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex justify-between items-center rounded-lg px-4 py-2 text-sm font-medium ${
                          pathname === href
                            ? "bg-gray-200 text-gray-700 font-semibold"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon size={18} />
                          {label}
                        </span>
                        {count > 0 && (
                          <span
                            className={`text-center w-6 font-semibold rounded ${
                              pathname === href ? "bg-white" : "bg-gray-200"
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
            <section className="px-4 py-6">
              <p className="text-xs font-semibold text-gray-500">TAGS</p>
              <ul className="mt-2 space-y-1">
                {tags.map((tag) => (
                  <li key={tag.id}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/tags/${tag.id}`}
                        className="flex items-center gap-3 px-2 py-1 hover:bg-gray-100 rounded flex-1"
                      >
                        <span
                          className="w-5 h-5 rounded-sm"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>{tag.name}</span>
                      </Link>
                      <button
                        onClick={() => {
                          if (editingtag?.id === tag.id) {
                            setOpentag((prev) => !prev);
                          } else {
                            setEditingtag(tag);
                            setOpentag(true);
                          }
                        }}
                        className="ml-2 px-2 py-1 text-sm text-gray-500 hover:text-violet-600"
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => {
                      setEditingtag(null);
                      setOpentag((prev) => !prev);
                    }}
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-violet-700"
                  >
                    + Add a new tag
                  </button>
                </li>

                {opentag && (
                  <div className="p-2 mt-2">
                    <TagForm
                      initialValues={editingtag}
                      onClose={() => {
                        setOpentag(false);
                        setEditingtag(null);
                      }}
                    />
                  </div>
                )}
              </ul>
            </section>
          </div>

          {/* Footer */}
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
        </>
      ) : (
        /* Collapsed */
        <>
          {/* Nav (icon + label stacked) */}
          <nav className="flex flex-col items-center gap-4 mt-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 text-xs ${
                  pathname === href
                    ? "bg-gray-200 text-gray-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
                title={label}
              >
                <Icon size={20} />
                <span className="text-[10px]">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Tags (color + name stacked) */}
          <section className="mt-6 flex flex-col items-center gap-3">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.id}`}
                className="flex flex-col items-center text-[10px] text-gray-600 hover:text-black"
                title={tag.name}
              >
                <span
                  className="w-5 h-5 rounded-sm"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-center">{tag.name}</span>
              </Link>
            ))}
          </section>

          {/* Footer (avatar + name below) */}
          <div className="mt-auto mb-4 flex flex-col items-center text-center">
            <Image
              alt="Profile"
              src="/pfp.png"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <p className="mt-1 text-[10px] font-medium">Neil</p>
          </div>
        </>
      )}
    </div>
  );
}
