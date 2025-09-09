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
      className={` overflow-y-auto max-sm:overflow-y-auto flex h-screen flex-col justify-between border-e border-gray-100 transition-all duration-300 ${
        showContent
          ? "w-[4rem] max-sm:w-[3rem] max-sm:bg-white"
          : "w-[18rem] bg-gray-50"
      } max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:border-none`}
    >
      <section>
        <div className="px-4 py-6 mb-10 ">
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
                          ? "bg-gray-200 text-gray-700 font-semibold"
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
                        className="flex items-center gap-4 px-2 py-1 hover:bg-gray-100 rounded flex-1"
                      >
                        <span
                          className="w-5 h-5 rounded-sm"
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
            <Image
              alt="Profile"
              src="/vercel.svg"
              width={40}
              height={40}
              className="rounded-full object-cover"
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
