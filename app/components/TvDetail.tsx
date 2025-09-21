"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { UserCircle } from "lucide-react";

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

    const [form, setForm] = useState({
        name: "",
        comment: ""
    });
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [msgLength, setMsgLength] = useState(1000);
    const [comments, setComments] = useState<Array<{id: number; movie_id: number; username: string; message: string; created_at: string;}>>([]);

    

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

    const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const input = e.target.value;
        setMsgLength(1000 - input.length);
        setForm({ ...form, comment: input });

        if (input.length > 1000) {
            setMsgLength(0)
            setForm({ ...form, comment: input.slice(0, 1000) });
        };

        if (!textareaRef.current) return;
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, name: e.target.value });
    }

    const postComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.name === "" || form.comment === "") return;

        try {
            await supabase.from('comments').insert([{
                movie_id: Number(movie_id),
                username: form.name,
                message: form.comment,
                type: 'tv'
            }]);
            setForm({ name: "", comment: "" });
            setMsgLength(1000);
            getComments();
        } catch (err) {
            console.error(err);
        }
    }

    const getComments = async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('movie_id', movie_id)
                .eq('type', 'tv')
                .order('id', { ascending: false });
            if (error) {
                console.error("Supabase insert error:", error.message, error.details);
            } else {
                setComments(data || []);
            }
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getComments();
    });
    

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
                    <div className="flex flex-wrap gap-4 items-center">
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
                    
                    <div className="flex flex-col max-h-96 overflow-y-auto custom-scrollbar">
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

            {/* Commentar */}
            <div className="flex flex-col w-full mt-20 px-10 h-auto items-center justify-center">
                <h1 className="font-bold opacity-80 italic text-2xl">COMMENTS</h1>
                {/* Input form */}
                <form onSubmit={postComment} className="flex flex-col w-full md:w-1/2 h-auto border-b-2  border-white/20 p-4">
                    <div className="flex flex-col md:flex-row h-auto items-center gap-4">
                        <Image
                            src={"/profile.png"} 
                            width={80} 
                            height={80} 
                            alt="" 
                            priority
                            className="rounded-full w-auto h-auto object-cover"
                        />
                        <div className="flex relative w-full">
                            <p className="absolute top-1 right-3 text-xs">{msgLength}</p>
                            <textarea 
                                ref={textareaRef}
                                value={form.comment ?? ""}
                                onChange={handleTextArea}
                                placeholder="Add your comment here..." 
                                rows={1}
                                className="flex-1 w-full min-h-24 h-auto p-4 mb-2 rounded-lg resize-none border border-red-500 outline-hidden placeholder:text-red-500 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rezise-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-end gap-2 items-center">
                        <div className="flex items-center relative w-full md:w-1/2">
                            <UserCircle className="absolute top-2 left-1.5 text-slate-100/50" />
                            <input 
                                type="text" 
                                value={form.name ?? ""}
                                onChange={handleInput}
                                placeholder="Your Name" 
                                className="w-full h-10 py-4 pl-10 pr-4 rounded-lg border border-red-500 outline-hidden placeholder:text-red-500"
                            />
                        </div>
                        <button type="submit" className="cursor-pointer bg-red-500 w-full md:w-40 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 ease-in-out">Post Comment</button>
                    </div>
                </form>

                {/* Comments list */}
                <div className="flex flex-col w-full md:w-1/2 max-h-[600px] overflow-y-auto [scrollbar-width:none] mt-10 space-y-6">
                    <h1 className="font-bold text-lg text-red-500">{comments.length} COMMENTS</h1>
                    {comments.length === 0 && <p className="text-center opacity-50">No comments yet. Be the first to comment!</p>}                    
                    {comments.map((comment) => [
                        <div key={comment.id} className="flex gap-4 border border-red-500/50 p-4 rounded-lg">
                            <div className="flex-shrink-0">
                                <Image
                                    src="/profile.png" 
                                    width={40} 
                                    height={40} 
                                    alt={`${comment.username}'s profile`}
                                    priority
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-semibold text-sm truncate pr-2 text-red-500">{comment.username}</p>
                                    <p className="text-xs text-gray-500 flex-shrink-0">{new Intl.DateTimeFormat('en-US', {
                                         day: '2-digit',
                                         month: 'short',
                                         year: 'numeric',
                                         hour: 'numeric',
                                         minute: 'numeric',
                                        }).format(new Date(comment.created_at))}
                                    </p>
                                </div>
                                <p className="break-words text-sm leading-relaxed">{comment.message}</p>
                            </div>
                        </div>
                    ])}
                </div>
            </div>
        </div>
    )
}