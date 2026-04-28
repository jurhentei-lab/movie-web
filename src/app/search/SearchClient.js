"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Moviecard from "@/app/_components/Moviecard";
import Header from "@/app/_features/Header";
import Footer from "@/app/_features/Footer";
import Skeleton from "@/components/ui/skeleton";
import { getVisiblePages } from "@/lib/pagination";
import { TMDB_BASE_URL, getTmdbFetchOptions } from "@/lib/tmdb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    setPageNumber(1);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError("");
      setTotalPages(1);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&language=en-US&page=${pageNumber}`,
          getTmdbFetchOptions()
        );
        if (!res.ok) {
          throw new Error(`Search failed with status ${res.status}`);
        }
        const data = await res.json();
        setResults(data.results || []);
        setTotalPages(Math.max(1, Math.min(data.total_pages || 1, 500)));
      } catch (err) {
        console.error(err);
        setError("Search failed. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, pageNumber]);

  return (
    <div className="flex min-h-screen flex-col gap-10">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Search results for{" "}
            <span className="text-indigo-600">{query || "..."}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {query
              ? "Browse matching titles from TMDB."
              : "Type a keyword in the search bar."}
          </p>
        </div>

        {!query ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-10 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Start searching to see results.
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : results.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No results found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((movie) => (
                <Moviecard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  rating={movie.vote_average}
                  image={movie.poster_path}
                />
              ))}
            </div>

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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
