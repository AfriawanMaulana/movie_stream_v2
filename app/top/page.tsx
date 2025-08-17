"use client"
import { useSearchParams } from "next/navigation";
import MovieList from "../components/MovieList";
import Navbar from "../components/Navbar";


export default function Page() {
    const params = useSearchParams().get('get')?.toString();

    return (
        <div>
            <head>
                <title>Top Rated - TERFLIX</title>
            </head>
            <Navbar />
            <section className="px-5 lg:px-14 py-20">
                <MovieList API_URL={`/api/tmdb/${params}/top_rated`} header="top rated" category={`${params}`} isPagination />
            </section>
        </div>
    )
}