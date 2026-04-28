import Header from "@/app/_features/Header";
import Footer from "@/app/_features/Footer";
import HeroSection from "@/app/_features/home/HeroSection";
import { MovieList } from "@/app/_features/home/MovieList";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-col gap-10 py-6 md:gap-14 md:py-8">
        <HeroSection />
        <MovieList type="popular" />
        <MovieList type="top_rated" />
        <MovieList type="upcoming" />
      </div>
      <Footer />
    </main>
  );
}
