"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useListContext } from "@/context/AppProvider";
import ListForm from "./ListForm";
import { listInput } from "@/utils/list/list.schema";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const pathname = usePathname();
  const { lists } = useListContext();
  const [editingList, setEditingList] = useState<listInput | null>(null);

  useEffect(() => {
    if (collapsed) {
      // Hide content after width transition ends
      const t = setTimeout(() => setShowContent(false), 150);
      return () => clearTimeout(t);
    } else {
      // Show content immediately when expanding
      setShowContent(true);
    }
  }, [collapsed]);

  const navItems = [
    { href: "/", label: "Today" },
    { href: "/upcoming", label: "Upcoming" },
    { href: "/calendar", label: "Calendar" },
    { href: "/notes", label: "Notes" },
  ];

  return (
    <div
      className={` flex h-screen flex-col justify-between border-e border-gray-100 bg-white transition-all duration-300 ${
        showContent ? "w-[4rem]" : "w-[18rem]"
      }`}
    >
      <section>
        <div className="px-4 py-6 mb-10">
          <div
            className={`flex mb-5 ${
              !showContent ? "justify-between" : "justify-center"
            }`}
          >
            {!showContent && <p>Menu</p>}
            <button onClick={() => setCollapsed(!collapsed)}>
              <Image
                src="/burger.svg"
                alt="burger-icon"
                width={24}
                height={24}
                className=""
              />
            </button>
          </div>

          {!showContent && (
            <>
              <p>TASKS</p>
              <ul className="mt-6 space-y-1">
                {navItems.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`block rounded-lg px-4 py-2 text-sm font-medium ${
                        pathname === href
                          ? "bg-gray-100 text-gray-700 font-semibold"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* here */}
        <div className="px-4 py-6">
          {!showContent && (
            <>
              <p>LISTS</p>
              <ul className="mt-6 space-y-1">
                {lists.map((list) => (
                  <li key={list.id}>
                    <div className="flex items-center justify-between">
                      {/* Navigation */}
                      <Link
                        href={`/lists/${list.name}`}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded flex-1"
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: list.color }}
                        />
                        <span>{list.name}</span>
                      </Link>

                      {/* Edit button */}
                      <button
                        onClick={() => {
                          if (editingList?.id === list.id) {
                            setOpenList((prev) => !prev);
                          } else {
                            setEditingList(list);
                            setOpenList(true);
                          }
                        }}
                        className="ml-2 px-2 py-1 text-sm text-gray-500 hover:text-black"
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                ))}

                <li>
                  <button
                    onClick={() => {
                      setEditingList(null);
                      setOpenList((prev) => !prev);
                    }}
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    + Add a new list
                  </button>
                </li>

                {openList && (
                  <div className="p-2 mt-2">
                    <ListForm
                      initialValues={editingList}
                      onClose={() => {
                        setOpenList(false);
                        setEditingList(null);
                      }}
                    />
                  </div>
                )}
              </ul>
            </>
          )}
        </div>
      </section>

      {!showContent && (
        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
          <a
            href="#"
            className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
          >
            <img
              alt=""
              src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              className="size-10 rounded-full object-cover"
            />

            <div>
              <p className="text-xs">
                <strong className="block font-medium">Eric Frusciante</strong>

                <span> eric@frusciante.com </span>
              </p>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
