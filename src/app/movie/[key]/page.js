"use client";
import StarIcon from "@/app/_icons/StarIcon";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/_features/Header";
import Footer from "@/app/_features/Footer";
import Trailer from "@/app/_components/Genresec/Trailer";
import { useRouter } from "next/navigation";
const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjI5ZmNiMGRmZTNkMzc2MWFmOWM0YjFjYmEyZTg1NiIsIm5iZiI6MTc1OTcxMTIyNy43OTAwMDAyLCJzdWIiOiI2OGUzMGZmYjFlN2Y3MjAxYjI5Y2FiYmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.M0DQ3rCdsWnMw8U-8g5yGXx-Ga00Jp3p11eRyiSxCuY";

export default function MoviePage() {
  const router = useRouter();
  const { key } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const res = await fetch(`${BASE_URL}/movie/${key}?language=en-US`, {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        });
        const data = await res.json();
        setMovieDetails(data);
      } catch (err) {
        console.error("Киноны мэдээлэл татахад алдаа гарлаа:", err);
      }
    }
    if (key) fetchMovieDetails();
  }, [key]);

  useEffect(() => {
    async function fetchTeamDetails() {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${key}/credits?language=en-US`,
          {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
          }
        );
        const data = await res.json();
        setTeamDetails(data);
      } catch (err) {
        console.error("Багийн мэдээлэл татахад алдаа гарлаа:", err);
      }
    }
    if (key) fetchTeamDetails();
  }, [key]);

  useEffect(() => {
    async function fetchSimilarMovies() {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${key}/similar?language=en-US&page=1`,
          {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
          }
        );
        const data = await res.json();
        setSimilarMovies(data.results || []);
      } catch (err) {
        console.error("Төстэй кинонууд татахад алдаа гарлаа:", err);
      }
    }
    if (key) fetchSimilarMovies();
  }, [key]);

  if (!movieDetails || !teamDetails) {
    return (
      <div className="flex min-h-screen flex-col gap-10">
        <Header />
        <main className="mx-auto w-full max-w-[1280px] px-4">
          <div className="flex flex-col gap-6">
            <div className="h-8 w-2/3 rounded-md bg-slate-200/70 animate-pulse dark:bg-slate-800/70" />
            <div className="h-4 w-1/3 rounded-md bg-slate-200/70 animate-pulse dark:bg-slate-800/70" />
            <div className="grid gap-6 md:grid-cols-[280px_1fr]">
              <div className="h-[420px] w-full rounded-lg bg-slate-200/70 animate-pulse dark:bg-slate-800/70" />
              <div className="h-[420px] w-full rounded-lg bg-slate-200/70 animate-pulse dark:bg-slate-800/70" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-4 w-full rounded-md bg-slate-200/70 animate-pulse dark:bg-slate-800/70" />
              <div className="h-4 w-5/6 rounded-md bg-slate-200/70 animate-pulse dark:bg-slate-800/70" />
              <div className="h-4 w-2/3 rounded-md bg-slate-200/70 animate-pulse dark:bg-slate-800/70" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  const poster_url = `https://image.tmdb.org/t/p/original${movieDetails.poster_path}`;
  const releaseDate = movieDetails.release_date
    ? movieDetails.release_date.replaceAll("-", ".")
    : "—";

  const parentalRating = movieDetails.adult ? "R" : "PG";
  const runtime = `${Math.floor(movieDetails.runtime / 60)}h ${
    movieDetails.runtime % 60
  }m`;

  const stars =
    teamDetails.cast
      ?.sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3)
      .map((m) => m.name)
      .join(" · ") || "—";

  const Writers =
    teamDetails.crew
      ?.sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3)
      .map((m) => m.name)
      .join(" · ") || "—";

  const Directors =
    teamDetails.crew
      ?.filter((m) => m.job === "Director")
      .map((m) => m.name)
      .join(" · ") || "—";

  console.log("Similar Movies:", similarMovies);
  return (
    <div className="flex min-h-screen flex-col gap-10">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-inter text-3xl font-extrabold leading-tight tracking-[-0.025em] text-slate-900 dark:text-slate-100 md:text-4xl">
              {movieDetails.title}
            </h1>
            <p className="font-inter text-sm text-slate-600 dark:text-slate-400 md:text-base">
              {releaseDate} · {parentalRating} · {runtime}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            <img
              src={poster_url}
              alt={movieDetails.title}
              className="h-[420px] w-full rounded-lg object-cover"
            />
            <div className="h-[420px] w-full overflow-hidden rounded-lg bg-black">
              <Trailer
                movieId={key}
                className="flex h-full w-full items-center justify-center p-0"
                playerClassName="h-full w-full rounded-lg"
                loadingClassName="text-sm text-white/90"
                emptyClassName="text-sm text-white/80"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <p className="font-inter text-[16px] leading-[24px] text-slate-800 dark:text-slate-200">
            {movieDetails.overview}
          </p>
          <div className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300">
            <p>
              <span className="font-semibold">Director:</span> {Directors}
            </p>
            <p>
              <span className="font-semibold">Writers:</span> {Writers}
            </p>
            <p>
              <span className="font-semibold">Stars:</span> {stars}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-inter text-xl font-semibold text-slate-900 dark:text-slate-100">
              More like this
            </h3>
            <button
              className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              onClick={() => router.push(`/movies/similar/${key}`)}
            >
              See all
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-2">
            {similarMovies.length > 0 ? (
              similarMovies.slice(0, 6).map((movie) => (
                <button
                  key={movie.id}
                  className="flex w-[180px] flex-shrink-0 flex-col text-left"
                  onClick={() => router.push(`/movie/${movie.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="h-[270px] w-full rounded-lg object-cover"
                  />
                  <div className="mt-2 flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                    <StarIcon />
                    {movie.vote_average.toFixed(1)}/10
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {movie.title}
                  </div>
                </button>
              ))
            ) : (
              <p>Төстэй кино олдсонгүй.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
