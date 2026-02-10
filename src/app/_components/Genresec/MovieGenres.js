import { useGenres } from "./useGenres";

export function MovieGenres({ genreIds }) {
  const genres = useGenres();

  return (
    <div className="flex flex-wrap gap-2">
      {genreIds.map((id) => (
        <span
          key={id}
          className="rounded-md bg-gray-200 px-2 py-1 text-sm text-gray-800 dark:bg-slate-800 dark:text-slate-200"
        >
          {genres[id] || "Unknown"}
        </span>
      ))}
    </div>
  );
}
