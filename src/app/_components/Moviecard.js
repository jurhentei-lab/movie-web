"use client";
import StarIcon from "../_icons/StarIcon";
import { useRouter } from "next/navigation";

function Moviecard({ id, title, rating, image, className }) {
  const router = useRouter();

  const imageUrl = image
    ? `https://image.tmdb.org/t/p/original${image}`
    : "/placeholder.svg";

  return (
    <button
      className={`group text-left ${className || ""}`}
      onClick={() => router.push(`/movie/${id}`)}
    >
      <div className="w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
        <img
          src={imageUrl}
          alt={title}
          className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="pt-2">
        <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
          <StarIcon />
          <span className="text-sm">
            {rating ? rating.toFixed(1) : "N/A"}/10
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-[16px] leading-[24px] text-slate-900 dark:text-slate-100">
          {title}
        </p>
      </div>
    </button>
  );
}

export default Moviecard;
