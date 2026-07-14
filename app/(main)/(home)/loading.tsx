import CarouselSkeleton from "../../components/CarouselSkeleton";
import MovieSkeleton from "../../components/MovieSkeleton";

export default function Loading() {
  return (
    <div>
      <CarouselSkeleton />
      <div className="px-5 lg:px-14 ">
        <MovieSkeleton count={6} isScroll />
        <MovieSkeleton count={6} isScroll />
        <MovieSkeleton count={6} isScroll />
        <MovieSkeleton count={6} isScroll />
      </div>
    </div>
  );
}
