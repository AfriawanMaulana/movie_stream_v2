import MovieList from "../components/MovieList";
import Navbar from "../components/Navbar";
import { getMovies } from "@/lib/tmdb/getMovies";

export default async function MovieSection({
  searchParams,
}: {
  searchParams: { page?: string; get?: string };
}) {
  const page = Number(searchParams?.page) || 1;
  const query = searchParams?.get || "movie";

  const top_rated = await getMovies(`/api/tmdb/${query}/top_rated`, page);

  return (
    <div>
      <title>Top Rated - TERFLIX</title>
      <Navbar />
      <section className="px-5 lg:px-14 py-20">
        <MovieList
          data={top_rated}
          category={query as string}
          header="Top rated"
          isPagination
        />
      </section>
    </div>
  );
}
