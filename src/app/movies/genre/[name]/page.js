"use client";

import Header from "@/app/_features/Header";
import Footer from "@/app/_features/Footer";
import { useParams } from "next/navigation";
import Moviecard from "@/app/_components/Moviecard";
import { useEffect, useState } from "react";
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

export default function GenrePage() {
  const { name } = useParams();
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        // Жанрын жагсаалт авах
        const res = await fetch(
          `${TMDB_BASE_URL}/genre/movie/list?language=en-US`,
          getTmdbFetchOptions()
        );
        const genreList = await res.json();

        // URL-д байгаа нэртэй жанрыг хайх
        const foundGenre = genreList.genres.find(
          (g) => g.name.toLowerCase().replace(/\s+/g, "-") === name
        );

        if (foundGenre) {
          const movieRes = await fetch(
            `${TMDB_BASE_URL}/discover/movie?language=en-US&with_genres=${foundGenre.id}&page=${pageNumber}`,
            getTmdbFetchOptions()
          );
          const data = await movieRes.json();
          setMovieData(data.results || []);
          setTotalPages(Math.max(1, Math.min(data.total_pages || 1, 500)));
        } else {
          setMovieData([]);
        }
      } catch (err) {
        console.error("Кино татахад алдаа гарлаа:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [name, pageNumber]);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1280px] px-4 py-8">
        <h1 className="mb-6 text-2xl font-semibold capitalize text-slate-900 dark:text-slate-100">
          {name.replace("-", " ")} movies
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
        ) : movieData.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movieData.map((movie) => (
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
        ) : (
          <p className="text-center text-gray-500 dark:text-slate-400">
            Энэ төрөлд кино олдсонгүй.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
