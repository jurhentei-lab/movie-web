"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Moviecard from "@/app/_components/Moviecard";

const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjI5ZmNiMGRmZTNkMzc2MWFmOWM0YjFjYmEyZTg1NiIsIm5iZiI6MTc1OTcxMTIyNy43OTAwMDAyLCJzdWIiOiI2OGUzMGZmYjFlN2Y3MjAxYjI5Y2FiYmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.M0DQ3rCdsWnMw8U-8g5yGXx-Ga00Jp3p11eRyiSxCuY";

export const MovieList = ({ type }) => {
  const router = useRouter();
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const res = await fetch(
          `${BASE_URL}/movie/${type}?language=en-US&page=1`,
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );
        const data = await res.json();
        setMovieData(data.results || []);
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, [type]);

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold capitalize text-slate-900 dark:text-slate-100">
          {type.replace("_", " ")}
        </h2>
        {movieData.length > 10 && (
          <button
            onClick={() => router.push(`/movies/${type}`)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            See more
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="aspect-[2/3] w-full rounded-lg bg-slate-200/70 animate-pulse dark:bg-slate-800/70" />
              <div className="h-4 w-3/4 rounded-md bg-slate-200/70 animate-pulse dark:bg-slate-800/70" />
              <div className="h-4 w-1/2 rounded-md bg-slate-200/70 animate-pulse dark:bg-slate-800/70" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movieData.slice(0, 10).map((movie) => (
            <Moviecard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              rating={movie.vote_average}
              image={movie.poster_path}
            />
          ))}
        </div>
      )}
    </section>
  );
};
