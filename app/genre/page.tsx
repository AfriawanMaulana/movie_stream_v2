"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Link from "next/link";

interface GenreType {
    genres: [
        { 
            id: number,
            name: string, 
        }
    ]
}

export default function Page() {
    const [genres, setGenres] = useState<GenreType>();


    useEffect(() => {
        axios.get('/api/tmdb/genre/movie/list')
            .then(res => setGenres(res.data))
            .catch(err => console.error(err))
    }, [])



    return (
        <div>
            <Navbar />
            <section className="flex flex-col space-y-8 px-5 lg:px-14 py-20">
                <div className="p-4 border-b border-white/20">
                    <h1 className="text-4xl">Genre</h1>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {genres?.genres.map((item) => (
                        <Link href={`/genre/${item.name.toLowerCase()}`} key={item.id} className="py-2.5 px-4 w-full md:w-[24.2%] rounded-md bg-white/10">
                            <p className="text-2xl text-white/90">{item.name}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}