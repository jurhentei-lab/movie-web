"use client";

import Header from "./_features/Header";
import Footer from "./_features/Footer";
import HeroSection from "./_features/home/HeroSection";

import { useEffect, useState } from "react";
import { MovieList } from "./_features/home/MovieList";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-10">
      <Header />

      <main className="flex flex-col gap-12">
        <HeroSection />

        <div className="flex flex-col gap-12">
          <MovieList type="popular" />
          <MovieList type="upcoming" />
          <MovieList type="top_rated" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
