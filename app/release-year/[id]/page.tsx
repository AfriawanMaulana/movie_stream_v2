"use client";
import MovieList from "@/app/components/MovieList";
import Navbar from "@/app/components/Navbar";
import { useParams } from "next/navigation";
import { useState } from "react";


export default function Page() {
    const [category, setCategory] = useState("movie");

    const params = useParams().id?.toString();
    return (
        <div>
            <Navbar />
            <section className="px-5 lg:px-14 py-20 flex flex-col space-y-10">
                <div className="relative border-t-2 border-white/20 flex w-full h-0 mt-10 items-center justify-center">
                    <h1 className="font-semibold text-3xl bg-background absolute px-4">{params}</h1>
                </div>
                <div className="my-4 flex gap-4">
                    <button onClick={() => setCategory('movie')} className={`${category === "movie" ? "text-red-500 border border-red-500 scale-105" : "border border-white/20 text-white/50"} transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md hover:cursor-pointer`}>MOVIE</button>
                    <button onClick={() => setCategory('tv')} className={`${category === "tv" ? "text-red-500 border border-red-500 scale-105" : "border border-white/20 text-white/50"} transition-all duration-200 ease-in-out text-sm font-semibold px-4 py-2 rounded-md hover:cursor-pointer`}>TV</button>
                </div>
                <MovieList API_URL={`/api/tmdb/discover/${category}?sort_by=${category === "movie" ? "release_date.desc&primary_release_year" : "first_air_date.desc&first_air_date_year"}=${params}`} 
                    header="" 
                    category={category} 
                    isParam 
                    isPagination 
                />
            </section>
        </div>
    )
}