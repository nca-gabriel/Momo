"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTagContext } from "@/context/AppProvider";
import TagForm from "./TagForm";
import { tagInput } from "@/utils/tag/tag.schema";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [opentag, setOpentag] = useState(false);
  const pathname = usePathname();
  const { tags } = useTagContext();
  const [editingtag, setEditingtag] = useState<tagInput | null>(null);

  const navItems = [
    { href: "/", label: "Today" },
    { href: "/upcoming", label: "Upcoming" },
    { href: "/calendar", label: "Calendar" },
    { href: "/notes", label: "Notes" },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className={`h-screen border-r border-gray-100  transition-all duration-300 ${
        collapsed ? "w-16 max-sm:w-11 " : "w-72 bg-gray-50"
      } shrink-0 flex flex-col`}
    >
      {/* Header */}
      <section className="flex items-center justify-between p-4">
        {!collapsed && <p className="font-bold">Menu</p>}
        <button onClick={() => setCollapsed(!collapsed)}>
          <Image src="/burger.svg" alt="burger-icon" width={24} height={24} />
        </button>
      </section>

      {!collapsed && (
        <>
          <div className="flex-1 overflow-y-auto">
            {/* Nav */}
            <nav className=" flex-1">
              <p className="px-4 text-xs font-semibold text-gray-500">TASKS</p>
              <ul className="mt-2 space-y-1">
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
            </nav>
            {/* tag */}
            <section className="px-4 py-6 ">
              <p className="text-xs font-semibold text-gray-500">TAGS</p>
              <ul className="mt-2 space-y-1">
                {tags.map((tag) => (
                  <li key={tag.id}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/tags/${tag.name}`}
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
                      setEditingtag(null);
                      setOpentag((prev) => !prev);
                    }}
                    className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
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
          {/* footer */}
          <div className="border-t border-gray-200 p-4 flex items-center gap-2">
            <Image
              alt="Profile"
              src="/vercel.svg"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">Eric Frusciante</p>
              <p className="text-xs text-gray-500">eric@frusciante.com</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
