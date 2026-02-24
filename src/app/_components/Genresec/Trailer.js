"use client";
import { useState, useEffect } from "react";

const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjI5ZmNiMGRmZTNkMzc2MWFmOWM0YjFjYmEyZTg1NiIsIm5iZiI6MTc1OTcxMTIyNy43OTAwMDAyLCJzdWIiOiI2OGUzMGZmYjFlN2Y3MjAxYjI5Y2FiYmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.M0DQ3rCdsWnMw8U-8g5yGXx-Ga00Jp3p11eRyiSxCuY";

const Trailer = ({
  movieId,
  className = "mx-auto flex w-full max-w-[960px] items-center justify-center px-4",
  playerClassName = "aspect-video w-full rounded-lg",
  loadingClassName = "text-sm text-slate-600 dark:text-slate-300",
  emptyClassName = "text-sm text-slate-600 dark:text-slate-300",
}) => {
  const [trailerData, setTrailerData] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!movieId) return;
    setTrailerData(null);
    fetchTrailerData(movieId);
  }, [movieId]);

  const fetchTrailerData = async (id) => {
    setStatus("loading");
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${id}/videos?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          }, 
        }
      );

      if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);

      const data = await response.json();
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      setTrailerData(trailer);
      setStatus("done");
    } catch (error) {
      setStatus("error");
      console.error("Error fetching trailer data:", error);
    }
  };

  return (
    <div className={className}>
      {trailerData ? (
        <iframe
          className={playerClassName}
          src={`https://www.youtube.com/embed/${trailerData.key}`}
          title="YouTube video player"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      ) : status === "done" ? (
        <p className={emptyClassName}>Trailer not available.</p>
      ) : (
        <p className={loadingClassName}>Loading trailer...</p>
      )}
    </div>
  );
};

export default Trailer;
