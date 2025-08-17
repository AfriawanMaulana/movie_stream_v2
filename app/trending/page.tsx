"use client";
import { useSearchParams } from "next/navigation";
import MovieList from "../components/MovieList";
import Navbar from "../components/Navbar";


export default function Trending() {
    const query = useSearchParams().get('get');

    return (
        <div>
            <head>
                <title>Most Watched - TERFLIX</title>
            </head>
            <Navbar />
            <section className="px-5 lg:px-14 py-20">
                <MovieList API_URL={`/api/tmdb/trending/${query}/week?language=en-US`} isParam header="Trending" category={`${query}`} isPagination />
            </section>
        </div>
    )
}