"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTodos } from "@/hooks/useTodos";
import { useTags } from "@/hooks/useTags";
import TagForm from "./TagForm";
import { TagData } from "@/utils/tag.schema";
import { filterTodos } from "@/utils/date";
import { TodoData } from "@/utils/todo.schema";
import { Calendar, FileText, ListTodo, Clock } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { signOut } from "next-auth/react";

const STORAGE_KEY = "sidebar-collapsed";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [opentag, setOpentag] = useState(false);
  const [editingtag, setEditingtag] = useState<TagData | null>(null);
  const pathname = usePathname();

  const { todosQuery } = useTodos();
  const { tagsQuery } = useTags();

  const todos = todosQuery.data ?? [];
  const tags = tagsQuery.data ?? [];

  const { data: session, isLoading, isError } = useSession();

  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw !== null) setCollapsed(JSON.parse(raw));
  }, []);

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

  const getTodoCountForRoute = (href: string) => {
    let filtered: TodoData[] = [];

    switch (href) {
      case "/":
        filtered = filterTodos("today", todos);
        break;
      case "/upcoming":
        filtered = filterTodos("thisWeek", todos);
        break;
      case "/calendar":
        filtered = todos;
        break;
      case "/notes":
        filtered = [];
        break;
      default:
        filtered = [];
    }

    filtered = filtered.filter((t) => !t.completed);
    return filtered.length;
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

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
          <Image
            src="/burger.svg"
            alt="burger-icon"
            width={24}
            height={24}
            unoptimized
          />
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
                        <span className="flex items-center gap-2">
                          <Icon size={18} />
                          {label}
                        </span>
                        {count > 0 && (
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
                  <div className="p-2 mt-2 ">
                    <TagForm
                      open={opentag}
                      initValues={editingtag}
                      onClose={() => {
                        setOpentag(false);
                        setEditingtag(null);
                      }}
                      onSubmit={(data) => console.log("submit tag", data)}
                      onDelete={(id) => console.log("delete tag", id)}
                    />
                  </div>
                )}
              </ul>
            </section>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 flex justify-between items-center gap-2">
            <section className="flex items-center gap-2">
              <Image
                alt={session?.user?.name || "Profile"}
                src={session?.user?.image || "/pfp.png"}
                width={32}
                height={32}
                className="rounded-full object-cover"
                unoptimized
              />
              <div className="flex flex-col p-0 m-0">
                <p className="text-sm font-medium">
                  {session?.user?.name || "Guest User"}
                </p>
                <p className="text-xs text-gray-500">
                  {session?.user?.email || "Not signed in"}
                </p>
              </div>
            </section>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-500 hover:text-violet-600"
            >
              Sign Out
            </button>
          </div>
        </>
      ) : (
        /* Collapsed */
        <>
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

          <div className="mt-auto mb-4 flex flex-col items-center text-center">
            <Image
              alt={session?.user?.name || "Profile"}
              src={session?.user?.image || "/pfp.png"}
              width={32}
              height={32}
              className="rounded-full object-cover"
              unoptimized
            />
            <p className="mt-1 text-[10px] font-medium">
              {session?.user?.name?.split(" ")[0] || "Guest"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
