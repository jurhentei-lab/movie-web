"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Vector from "../_icons/VectorIcon";
import Search from "../_icons/SearchIcon";
import Moon from "../_icons/MoonIcon";
import Genre from "../_components/Genresec/Genre";

function Header() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      stored === "dark" ||
      (!stored &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;

    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-4">
        <button
          className="flex items-center gap-2"
          onClick={() => router.push("/")}
          aria-label="Go home"
        >
          <Vector />
        </button>

        <div className="flex w-full max-w-[640px] items-center gap-3">
          <Genre />

          <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
            <button onClick={handleSearch} aria-label="Search">
              <Search />
            </button>

            <input
              type="text"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
        </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            <Moon />
          </button>
        </div>
    </header>
  );
}

export default Header;
