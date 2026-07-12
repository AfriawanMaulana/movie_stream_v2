"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Bookmark, Play, Star, User, Crown } from "lucide-react";
import Link from "next/link";
import MovieDetailSkeleton from "./MovieDetailSkeleton";
import { addToWatchlist, checkWatchlist } from "../actions/addToWatchlist";
import { toast } from "react-toastify";
import { useUserStore } from "@/zustand/userStore";
import { addComments, getComments } from "../actions/addComments";
import { CommentType } from "@/types/commentType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataType {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  origin_country: string;

  genres: [
    {
      id: number;
      name: string;
    }
  ];

  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };

  poster_path: string;
  backdrop_path: string;
  tagline: string;
  release_date: string;
  overview: string;
  vote_average: number;
  runtime: number;
  status: string;
}

interface CastProps {
  id: number;
  cast: [
    {
      adult: boolean;
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      original_name: string;
      popularity: number;
      profile_path: string;
      cast_id: number;
      character: string;
      credit_id: string;
      order: number;
    }
  ];
}

const servers = [
  {
    id: 1,
    name: "Server 1",
    disabled: true,
    endpoint: `${process.env.NEXT_PUBLIC_VIDSRC_API}/movie`,
    isPremium: false,
  },
  {
    id: 2,
    name: "Server 2",
    disabled: false,
    endpoint: `https://vidsrc.ru/movie`,
    isPremium: false,
  },
  {
    id: 3,
    name: "Server 3",
    disabled: false,
    endpoint: `${process.env.NEXT_PUBLIC_VIDSRC2_API}/movie`,
    isPremium: false,
  },
  {
    id: 4,
    name: "Server 4",
    disabled: false,
    endpoint: `${process.env.NEXT_PUBLIC_VIDSRC3_API}/movie`,
    isPremium: true,
  },
];

type Props = {
  movie: DataType;
};

export default function MovieDetail({ movie }: Props) {
  const router = useRouter();
  const movie_id = useSearchParams().get("id");
  const { user, fetchUser } = useUserStore();
  const [switchServer, setSwitchServer] = useState(2);
  const data = movie;
  const [dataCast, setDataCast] = useState<CastProps | null>(null);
  const [isWatch, setIsWatch] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [form, setForm] = useState({
    comment: "",
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [msgLength, setMsgLength] = useState(500);
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const stream_url = servers
    .filter((item) => item.id === switchServer)
    .map((e) => e.endpoint);

  const userNotPremium = () => {
    return !user || (user.role !== "premium" && user.role !== "admin");
  };

  useEffect(() => {
    axios
      .get(`/api/tmdb/movie/${movie_id}/credits`)
      .then((res) => setDataCast(res.data))
      .catch((err) => console.error(err));
  }, [movie_id]);

  const handleTextArea = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const input = e.target.value;
    setMsgLength(500 - input.length);
    setForm({ ...form, comment: input });

    if (input.length > 500) {
      setMsgLength(0);
      setForm({ ...form, comment: input.slice(0, 500) });
    }

    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 120) + "px";
  };

  // Check watchlist
  useEffect(() => {
    async function loadWatchlist() {
      const saved = await checkWatchlist(String(data.id));
      setIsSaved(saved);
    }

    if (data.id) {
      loadWatchlist();
    }
  }, [data.id]);

  const handleAddToWatchlist = async () => {
    const result = await addToWatchlist({
      movie_id: String(data.id),
      poster_path: data.poster_path ?? "",
      title: data.title || data.original_title || "",
      category: "movie",
    });

    if (result.success) {
      setIsSaved(!!result.isSaved);
    } else {
      router.push("/auth/login");
      toast.error(result.error);
    }
  };

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.comment === "") return;

    try {
      const res = await addComments({
        movie_id: String(data.id),
        title: data.title || data.original_title || "",
        message: form.comment,
        category: "movie",
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setForm({ comment: "" });
      setMsgLength(500);
      const updated = await getComments(String(data.id));
      setComments(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToPlayer = () => {
    setIsWatch(true);
    const player = document.getElementById("player");
    if (player) {
      player.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComments(String(data.id));

        setComments(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [data.id]);

  useEffect(() => {
    if (!comments.length) return;

    const id = window.location.hash.replace("#", "");

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  }, [comments]);

  useEffect(() => {
    window.addEventListener("load", () => {
      if (!window.location.hash) window.scrollTo(0, 0);
    });
  }, []);

  if (!data) return <MovieDetailSkeleton />;

  return (
    <div className="py-20 flex flex-col space-y-10">
      <div className="flex gap-5 pb-4">
        {/* Movie Info */}
        <div className="relative w-full md:h-[75vh] h-[80vh]">
          <Image
            src={`https://image.tmdb.org/t/p/original/${data.backdrop_path}`}
            fill
            alt={`${data.title}`}
            unoptimized
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 gap-10 bg-gradient-to-t from-background to-transparent w-full h-full">
            <div className="absolute bottom-4 left-4 flex flex-col md:flex-row gap-5">
              <Image
                src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                width={130}
                height={130}
                alt={`${data.title}`}
                unoptimized
                className="w-36 md:w-52 h-auto object-cover rounded-xl"
              />
              <div className="flex flex-col space-y-4">
                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold">
                  {data.original_language === "id"
                    ? data.original_title
                    : data.title}
                </h1>
                {/* Rating */}
                <div className="flex gap-2 items-center">
                  <span className="text-sm flex items-center gap-2">
                    <Star fill="gold" stroke="none" size={16} />
                    <p className="opacity-50">
                      {data.vote_average.toFixed(1)} / 10
                    </p>
                  </span>
                  <span className="text-xs">·</span>
                  {data.runtime && (
                    <p className="opacity-50 text-sm">
                      {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                    </p>
                  )}
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">{data.origin_country}</p>
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">{data.release_date}</p>
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">{data.status}</p>
                </div>
                {/* Category */}
                <div className="flex flex-wrap gap-2">
                  {data.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/genre/${genre.name}`}
                      className="bg-red-500/20 border border-red-500 text-white/80 rounded-md py-1 px-2 text-sm"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
                {/* Synopsis */}
                <p className="opacity-50 font-sans md:w-3/4">{data.overview}</p>
                {/* Watch Button */}
                <div className="flex gap-4 items-center">
                  <button
                    onClick={scrollToPlayer}
                    className="flex gap-2 items-center justify-center border border-red-500 bg-red-600 hover:bg-red-700 rounded-lg p-2 cursor-pointer w-36 font-semibold text-sm h-11 transition-all ease-in-out duration-300"
                  >
                    <Play size={16} fill="white" stroke="none" /> Watch Now
                  </button>
                  <button
                    onClick={handleAddToWatchlist}
                    className="text-red-500 cursor-pointer"
                  >
                    <Bookmark fill={isSaved ? "red" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        {/* Video frame */}
        <div id="player">
          {isWatch && (
            <div className="my-10 space-y-4">
              {/* Server Selector */}
              <Select
                value={String(switchServer)}
                onValueChange={(value) => setSwitchServer(Number(value))}
              >
                <SelectTrigger className="w-40 rounded-md border border-red-500 bg-background h-10 px-3 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select server" />
                </SelectTrigger>

                <SelectContent className="border-red-500 bg-background text-white">
                  {servers.map((server) => (
                    <SelectItem
                      key={server.id}
                      value={String(server.id)}
                      disabled={
                        server.disabled ||
                        (server.isPremium && userNotPremium())
                      }
                      className="
                        cursor-pointer
                        rounded-md
                        my-1
                        px-3
                        py-2
                        hover:bg-red-500/50
                        hover:text-white
                        focus:bg-red-500/50
                        focus:text-white
                        data-[state=checked]:bg-red-500
                        data-[state=checked]:text-white
                      "
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span>{server.name}</span>

                          {server.isPremium && (
                            <Crown
                              size={14}
                              className={`${
                                userNotPremium()
                                  ? "fill-yellow-500 stroke-yellow-400"
                                  : "fill-zinc-300 stroke-zinc-300 opacity-50"
                              }`}
                            />
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <iframe
                loading="lazy"
                src={`${stream_url}/${movie_id}`}
                title="Movie player"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; allowFullScreen; gyroscope; picture-in-picture"
                referrerPolicy="no-referrer"
                className="flex w-full h-[315px] md:h-screen"
                // sandbox={
                //   switchServer === 1
                //     ? "allow-scripts allow-same-origin allow-forms"
                //     : undefined
                // }
              ></iframe>
            </div>
          )}
        </div>
        {/* Cast */}
        <h1 className="text-2xl font-semibold mb-4 border-l-4 border-red-500 px-2">
          Cast
        </h1>
        <div className="flex overflow-x-auto space-x-5 md:space-x-10 no-scrollbar">
          {dataCast?.cast.map((cast, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center flex-shrink-0"
            >
              {cast.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`}
                  width={100}
                  height={100}
                  alt={`${cast.name}`}
                  className="w-28 h-28 object-cover object-center rounded-full"
                />
              ) : (
                <div className="w-28 h-28 bg-primary rounded-full items-center justify-center flex">
                  <User size={40} />
                </div>
              )}
              <h1 className="font-semibold">{cast.name}</h1>
              <p className="text-xs opacity-50">{cast.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commentar */}
      <div className="flex flex-col w-full mt-20 px-10 h-auto items-center justify-center">
        <h1 className="font-bold opacity-80 italic text-2xl">COMMENTS</h1>
        {/* Input form */}
        <form
          onSubmit={postComment}
          className="flex flex-col w-full md:w-1/2 h-auto border-b-2  border-white/20 p-4"
        >
          <div className="flex flex-col md:flex-row h-auto items-center gap-4">
            <div className="w-32 h-32 flex flex-shrink-0 justify-center items-center bg-red-500 rounded-full">
              {user ? (
                <h2 className="font-semibold text-4xl">{user?.username[0]}</h2>
              ) : (
                <User size={40} className="opacity-80" />
              )}
            </div>
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="cursor-pointer bg-red-500 w-full md:w-40 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 ease-in-out"
            >
              Post Comment
            </button>
          </div>
        </form>

        {/* Comments list */}
        <div className="flex flex-col w-full md:w-1/2 max-h-[600px] overflow-y-auto [scrollbar-width:none] mt-10 space-y-6">
          <h1 className="font-bold text-lg text-red-500">
            {comments.length} COMMENTS
          </h1>
          {comments.length === 0 && (
            <p className="text-center opacity-50">
              No comments yet. Be the first to comment!
            </p>
          )}
          {comments.map((comment) => [
            <div
              key={comment.id}
              id={`comment-${comment.id}`}
              className="flex gap-4 border border-red-500/50 p-4 rounded-lg"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 flex flex-shrink-0 justify-center items-center bg-red-500 rounded-full">
                  {user ? (
                    <h2 className="font-semibold text-xl">
                      {user?.username[0]}
                    </h2>
                  ) : (
                    <User size={16} className="opacity-80" />
                  )}
                </div>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm truncate pr-2 text-red-500">
                    {comment.username}
                  </p>
                  <p className="text-xs text-gray-500 flex-shrink-0">
                    {new Intl.DateTimeFormat("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    }).format(new Date(comment.createdAt))}
                  </p>
                </div>
                <p className="break-words text-sm leading-relaxed">
                  {comment.message}
                </p>
              </div>
            </div>,
          ])}
        </div>
      </div>
    </div>
  );
}
