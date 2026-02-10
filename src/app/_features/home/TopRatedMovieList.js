"use client";

import { useState, useEffect } from "react";
import Moviecard from "@/app/_components/Moviecard";

const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjI5ZmNiMGRmZTNkMzc2MWFmOWM0YjFjYmEyZTg1NiIsIm5iZiI6MTc1OTcxMTIyNy43OTAwMDAyLCJzdWIiOiI2OGUzMGZmYjFlN2Y3MjAxYjI5Y2FiYmIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.M0DQ3rCdsWnMw8U-8g5yGXx-Ga00Jp3p11eRyiSxCuY";

function TopRated() {
  const [movieData, setmovieData] = useState([]);

  const getData = async () => {
    const topRatedEndpoint = `${BASE_URL}/movie/top_rated?language=en-US&page=1`;
    const response = await fetch(topRatedEndpoint, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setmovieData(data.results);
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(movieData);
  return (
    <div className="flex w-[1437px] gap-[32px] pr-[80px] pl-[80px] flex-col">
      <div className="flex w-[1277px] h-[36px] justify-between rotate-0 opacity-100">
        <p>Top rated</p>
        <button className="w-[120px] h-[36px] rotate-0 opacity-100 gap-[8px] pt-2 pr-4 pb-2 pl-4 rounded-md flex">
          See more{" "}
        </button>
      </div>
      <div className="grid grid-cols-5 max-w-[1440px]  w-[1277px]  rotate-0 opacity-100 gap-[32px] ">
        {movieData.map((movie) => (
          <Moviecard
            key={movie.id}
            title={movie.title}
            rating={movie.vote_average}
            image={movie.poster_path}
          />
        ))}
      </div>
    </div>
  );
}
export default TopRated;
