"use client";
import { useParams } from "next/navigation";
import MovieList from "../../components/MovieList";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import NotFound from "@/app/components/NotFound";

type Data = {
  total_results: number;
};

export default function Page() {
  const params = useParams().slug?.toString();
  const [data, setData] = useState<Data>();
  useEffect(() => {
    axios
      .get(`/api/tmdb/discover/movie?with_original_language=${params}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [params]);

  return (
    <div className="flex flex-col">
      <title>TERFLIX</title>
      <Navbar />
      <section className="px-5 lg:px-14 py-20">
        {data?.total_results == 0 ? (
          <NotFound />
        ) : (
          <MovieList
            API_URL={`/api/tmdb/discover/movie?language=${
              params === "id" ? "id-ID" : "en-US"
            }&with_original_language=${params}&sort_by=primary_realese_date.desc`}
            category="movie"
            header="popular"
            isPagination
            isParam
          />
        )}
      </section>
    </div>
  );
}
