"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface DataType {
    id: number;
    name: string;
    poster_path: string;
    tagline: string;
    first_air_date: string;
    overview: string;
    seasons: [
        {
            id: number;
            episode_count: number;
            name: string;
            poster_path: string;
            season_number: number;
        }
    ]
    number_of_seasons: number;
};

interface EpisodeType {
    _id: string;
    air_date: string;
    episodes: [
        {
            air_date: string;
            episode_number: number;
            episode_type: string;
            id: number;
            name: string;
            overview: string;
            runtime: number;
            season_number: string;
            still_path: string;
        }
    ]
};


export default function TvDetail({ specific }: { specific?: string }) {
    const movie_id = useSearchParams().get('id');
    const [data, setData] = useState<DataType | null>(null);
    const [dataEpisode, setDataEpisode] = useState<EpisodeType | null>(null);
    const [season, setSeason] = useState(1);
    

    const stream_url = process.env.NEXT_PUBLIC_VIDSRC_API + "/tv";
    useEffect(() => {
        // API TV Detail
        axios.get(`/api/tmdb/tv/${movie_id}`)
            .then(res => setData(res.data))
            .catch(err => console.error(err))

        // API TV Episode by Season
        axios.get(`/api/tmdb/tv/${movie_id}/season/${season}`)
            .then(res => setDataEpisode(res.data))
            .catch(err => console.error(err))
        
    }, [movie_id, season]);

    const slugify = (str: string) => {
        if (!str) return ''
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
    }

    return (
        <div className="py-20 flex flex-col space-y-10">
            <div>     
                <iframe 
                    loading="lazy"
                    src={!specific ? `${stream_url}/${movie_id}?autoPlay=false` : `${stream_url}/${movie_id}/${specific}?autoPlay=false`}
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
                <div className="border-b border-white/20 pb-4">
                    <h1 className="text-xl font-sans">Synopsis</h1>
                    <p className="opacity-50 font-sans">{data?.overview}</p>
                </div>

                {/* Seasons & Episodes */}
                <div className="flex flex-col space-y-6 my-4">
                    <div className="flex gap-4 items-center">
                        {[...Array(data?.number_of_seasons)].map((_, i) => (
                            <button 
                                key={i + 1} 
                                onClick={() => setSeason(i + 1)}
                                className={`${season === i + 1 ? "bg-red-500 text-white scale-101" : "" } border border-red-500 py-1 px-2 rounded-sm text-red-500 hover:bg-red-500 hover:text-white`}
                            >
                                Season {i + 1}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex flex-col">
                        {dataEpisode?.episodes.map((item) => {
                            if (!item.still_path) return;
                            return (
                                <div 
                                    key={item.id} 
                                    className="flex py-2 gap-4 border-b border-white/20 items-center"
                                >
                                    <Image src={`https://image.tmdb.org/t/p/w500${item.still_path}`} width={100} height={100} alt={`${data?.name}`} />
                                    <h1 className="border-r border-white/20 pr-4 py-2 text-sm font-semibold">{item.runtime}min</h1>
                                    <Link href={`/episode/${slugify(data?.name as string)}-season-${item.season_number}-episode-${item.episode_number}?id=${movie_id}`} className="w-full hover:text-red-500">
                                        <h1>{item.name}</h1>
                                        <p className="text-xs text-white/40">{item.air_date && new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(item.air_date)).split(' ').join(', ')}</p>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}