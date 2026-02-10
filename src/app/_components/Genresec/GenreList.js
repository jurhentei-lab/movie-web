"use client";

import { Badge } from "@/components/ui/badge";
import ChevronRightIcon from "@/app/_icons/Chevronright";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjI5ZmNiMGRmZTNkMzc2MWFmOWM0YjFjYmEyZTg1NiIsIm5iZiI6MTc1OTcxMTIyNy43OTAwMDAyLCJzdWIiOiI2OGUzMGZmYjFlN2Y3MjAxYjI5Y2FiYmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.M0DQ3rCdsWnMw8U-8g5yGXx-Ga00Jp3p11eRyiSxCuY";

export default function GenreList() {
  const [genreData, setGenreData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getGenres() {
      try {
        const res = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        });
        const data = await res.json();
        setGenreData(data.genres || []);
      } catch (err) {
        console.error("Жанрын мэдээлэл татахад алдаа гарлаа:", err);
      }
    }
    getGenres();
  }, []);

  const handleGenreClick = (genreName) => {
    const slug = genreName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/movies/genre/${slug}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-[28px] font-bold text-gray-900 dark:text-slate-100">
          Genres
        </h2>
        <p className="mt-1 text-base text-gray-500 dark:text-slate-400">
          See lists of movies by genre
        </p>
      </div>
      <div className="h-px w-full bg-gray-200 dark:bg-slate-800" />

      {genreData.length === 0 ? (
        <p className="text-gray-400 text-xs dark:text-slate-500">
          Loading...
        </p>
      ) : (
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {genreData.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.name)}
              className="focus:outline-none"
            >
              <Badge className="flex w-full items-center justify-between gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-left text-sm font-semibold leading-[16px] text-[rgba(9,9,11,1)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                {genre.name}
                <ChevronRightIcon />
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
