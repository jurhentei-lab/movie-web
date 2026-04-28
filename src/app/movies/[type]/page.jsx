"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Moviecard from "@/app/_components/Moviecard";
import Header from "@/app/_features/Header";
import Footer from "@/app/_features/Footer";
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

export default function MovieCategoryPage() {
  const { type } = useParams();
  const [movies, setMovies] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const getMovies = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${TMDB_BASE_URL}/movie/${type}?language=en-US&page=${page}`,
        getTmdbFetchOptions()
      );
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(Math.max(1, Math.min(data.total_pages || 1, 500)));
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies(pageNumber);
  }, [type, pageNumber]);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1280px] px-4 py-8">
        <h1 className="mb-5 text-2xl font-semibold capitalize text-slate-900 dark:text-slate-100">
          {type.replace("_", " ")} movies
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
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
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
