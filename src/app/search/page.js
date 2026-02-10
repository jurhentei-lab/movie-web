"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Moviecard from "@/app/_components/Moviecard";
import Header from "@/app/_features/Header";
import Footer from "@/app/_features/Footer";
import Skeleton from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjI5ZmNiMGRmZTNkMzc2MWFmOWM0YjFjYmEyZTg1NiIsIm5iZiI6MTc1OTcxMTIyNy43OTAwMDAyLCJzdWIiOiI2OGUzMGZmYjFlN2Y3MjAxYjI5Y2FiYmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.M0DQ3rCdsWnMw8U-8g5yGXx-Ga00Jp3p11eRyiSxCuY";

export default function SearchPage() {
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
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `${BASE_URL}/search/movie?query=${encodeURIComponent(
            query
          )}&language=en-US&page=${pageNumber}`,
          {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
          }
        );
        if (!res.ok) {
          throw new Error("Search failed");
        }
        const data = await res.json();
        setResults(data.results || []);
        setTotalPages(data.total_pages || 1);
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
                      onClick={() =>
                        setPageNumber((prev) => Math.max(1, prev - 1))
                      }
                      disabled={pageNumber === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;

                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= pageNumber - 1 && page <= pageNumber + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === pageNumber}
                            onClick={() => setPageNumber(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === pageNumber - 2 ||
                      page === pageNumber + 2
                    ) {
                      return <PaginationEllipsis key={`ellipsis-${page}`} />;
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setPageNumber((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={pageNumber === totalPages}
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
