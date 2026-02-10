"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Moviecard from "@/app/_components/Moviecard";

const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjI5ZmNiMGRmZTNkMzc2MWFmOWM0YjFjYmEyZTg1NiIsIm5iZiI6MTc1OTcxMTIyNy43OTAwMDAyLCJzdWIiOiI2OGUzMGZmYjFlN2Y3MjAxYjI5Y2FiYmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.M0DQ3rCdsWnMw8U-8g5yGXx-Ga00Jp3p11eRyiSxCuY";
export default function MoreLikeThis({ movieId }) {
  const router = useRouter();
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    async function fetchSimilarMovies() {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${movieId}/similar?language=en-US&page=1`,
          {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
          }
        );
        const data = await res.json();
        setSimilarMovies(data.results || []);
      } catch (err) {
        console.error("Error fetching similar movies:", err);
      }
    }

    if (movieId) fetchSimilarMovies();
  }, [movieId]);

  return (
    <div className="flex w-[1080px] h-[372.38px] gap-8 rotate-0 opacity-100">
      {similarMovies.slice(0, 5).map((movie) => (
        <Moviecard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          rating={movie.vote_average}
          image={movie.poster_path}
        />
      ))}
    </div>
  );
}
