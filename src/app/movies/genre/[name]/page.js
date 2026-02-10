"use client";

import Header from "@/app/_features/Header";
import Footer from "@/app/_features/Footer";
import { useParams } from "next/navigation";
import Moviecard from "@/app/_components/Moviecard";
import Movielist from "@/app/_features/home/MovieList";
import { useEffect, useState } from "react";
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
        const res = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        });
        const genreList = await res.json();

        // URL-д байгаа нэртэй жанрыг хайх
        const foundGenre = genreList.genres.find(
          (g) => g.name.toLowerCase().replace(/\s+/g, "-") === name
        );

        if (foundGenre) {
          const movieRes = await fetch(
            `${BASE_URL}/discover/movie?language=en-US&with_genres=${foundGenre.id}&page=${pageNumber}`,
            {
              headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
            }
          );
          const data = await movieRes.json();
          setMovieData(data.results || []);
          setTotalPages(data.total_pages || 1);
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
