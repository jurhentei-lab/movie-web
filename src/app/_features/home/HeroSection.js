"use client";
import { useState, useEffect } from "react";
import StarIcon from "@/app/_icons/StarIcon";
import TrailerIcon from "@/app/_icons/TrailerIcon";
import Trailer from "@/app/_components/Genresec/Trailer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjI5ZmNiMGRmZTNkMzc2MWFmOWM0YjFjYmEyZTg1NiIsIm5iZiI6MTc1OTcxMTIyNy43OTAwMDAyLCJzdWIiOiI2OGUzMGZmYjFlN2Y3MjAxYjI5Y2FiYmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.M0DQ3rCdsWnMw8U-8g5yGXx-Ga00Jp3p11eRyiSxCuY";

function HeroSection() {
  const [heroList, setHeroList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heroDataDetails, setHeroDataDetails] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const getData = async () => {
    try {
      const trendingEndpoint = `${BASE_URL}/movie/now_playing?language=en-US&page=1`;
      const response = await fetch(trendingEndpoint, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("TMDB API error", response.status, text);
        return;
      }

      const data = await response.json();
      setHeroList(data.results);
      if (data.results[0]) {
        getHeroDetails(data.results[0].id);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const getHeroDetails = async (movieId) => {
    try {
      const detailsEndpoint = `${BASE_URL}/movie/${movieId}?language=en-US`;
      const response = await fetch(detailsEndpoint, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("TMDB API алдаа:", response.status, text);
        return;
      }

      const detailsData = await response.json();
      setHeroDataDetails(detailsData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % heroList.length;
    setCurrentIndex(nextIndex);
    getHeroDetails(heroList[nextIndex].id);
    setShowTrailer(false);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + heroList.length) % heroList.length;
    setCurrentIndex(prevIndex);
    getHeroDetails(heroList[prevIndex].id);
    setShowTrailer(false);
  };

  const heroData = heroList[currentIndex];

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4">
      <div className="relative overflow-hidden rounded-2xl bg-slate-200">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              {heroData ? (
                <>
                  <img
                    src={`https://image.tmdb.org/t/p/original${heroData.backdrop_path}`}
                    alt={heroData.title}
                    className="h-[360px] w-full object-cover md:h-[520px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                  <div className="absolute left-6 top-20 z-10 flex max-w-[420px] flex-col gap-4 text-white md:left-12 md:top-32">
                    <p className="font-inter text-sm uppercase tracking-wider text-white/80">
                      Now Playing
                    </p>
                    <h1 className="font-inter text-3xl font-extrabold leading-tight md:text-4xl">
                      {heroData.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm">
                      <StarIcon /> {heroData.vote_average.toFixed(1)}/10
                    </div>
                    <p className="line-clamp-4 text-sm text-white/90 md:text-base">
                      {heroDataDetails?.overview}
                    </p>

                    {!showTrailer && (
                      <button
                        className="inline-flex items-center justify-center"
                        onClick={() => setShowTrailer(true)}
                        aria-label="Watch trailer"
                      >
                        <TrailerIcon />
                      </button>
                    )}
                  </div>

                  {showTrailer && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
                      <Trailer movieId={heroData.id} />
                    <button
                      className="absolute right-5 top-5 text-3xl font-bold text-white hover:text-gray-300"
                      onClick={() => setShowTrailer(false)}
                    >
                      ✕
                    </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-[360px] w-full animate-pulse bg-slate-200 dark:bg-slate-800 md:h-[520px]" />
              )}
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous"
          disabled={heroList.length === 0}
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-transparent text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next"
          disabled={heroList.length === 0}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
