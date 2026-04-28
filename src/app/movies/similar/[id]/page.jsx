"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/_features/Header";
import Footer from "@/app/_features/Footer";
import Moviecard from "@/app/_components/Moviecard";
import Skeleton from "@/components/ui/skeleton";
import { getVisiblePages } from "@/lib/pagination";
import { TMDB_BASE_URL, getTmdbFetchOptions } from "@/lib/tmdb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function SimilarMoviesPage() {
  const { id } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSimilar() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(
          `${TMDB_BASE_URL}/movie/${id}/similar?language=en-US&page=${pageNumber}`,
          getTmdbFetchOptions()
        );
        const data = await res.json();
        setMovies(data.results || []);
        setTotalPages(Math.max(1, Math.min(data.total_pages || 1, 500)));
      } catch (err) {
        console.error("Failed fetching similar movies:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSimilar();
  }, [id, pageNumber]);

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-[1280px] px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Similar movies
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((m) => (
              <Moviecard
                key={m.id}
                id={m.id}
                title={m.title}
                rating={m.vote_average}
                image={m.poster_path}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-slate-400">
            No similar movies found.
          </p>
        )}

        <div className="flex justify-center py-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageNumber === 1) return;
                    setPageNumber((prev) => Math.max(1, prev - 1));
                  }}
                  aria-disabled={pageNumber === 1}
                  className={pageNumber === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getVisiblePages(pageNumber, totalPages).map((item, index) =>
                item === "ellipsis" ? (
                  <PaginationEllipsis key={`ellipsis-${index}`} />
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={item === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        setPageNumber(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageNumber === totalPages) return;
                    setPageNumber((prev) => Math.min(totalPages, prev + 1));
                  }}
                  aria-disabled={pageNumber === totalPages}
                  className={
                    pageNumber === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>

      <Footer />
    </>
  );
}
