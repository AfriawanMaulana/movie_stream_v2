"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface DataType {
    id: number;
    name: string;
    poster_path: string;
    tagline: string;
    first_air_date: string;
    overview: string;
}
export default function TvDetail() {
    const movie_id = useSearchParams().get('id');
    const [data, setData] = useState<DataType | null>(null);

    const stream_url = process.env.NEXT_PUBLIC_VIDSRC_API + "/tv";
    useEffect(() => {
        axios.get(`/api/tmdb/tv/${movie_id}`)
            .then(res => setData(res.data))
            .catch(err => console.error(err))
    }, [movie_id])

    console.log(stream_url)
    return (
        <div className="py-20 flex flex-col space-y-10">
            <div>     
                <iframe 
                loading="lazy"
                src={`${stream_url}/${movie_id}`}
                title="Movie player" 
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="flex w-full h-[315px] md:h-screen"
                >
            </iframe>
            </div>
            <div className="px-5">
                <div className="flex gap-5 border-b border-white/20 pb-4">
                    <Image src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`} width={130} height={130} alt={`${data?.name}`} />
                    <div className="flex flex-col space-y-1">
                        <h1 className="text-3xl">{data?.name}</h1>
                        <p className="opacity-70">{data?.tagline}</p>
                        <p className="opacity-50 text-sm">{data?.first_air_date}</p>
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-sans">Synopsis</h1>
                    <p className="opacity-50 font-sans">{data?.overview}</p>
                </div>
            </div>
        </div>
    )
}