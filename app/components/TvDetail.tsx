"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Play, Star, User, UserCircle } from "lucide-react";
import TVDetailSkeleton from "./TVDetailSkeleton";

interface DataType {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
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
  ];
  number_of_seasons: number;
  original_language: string;
  original_name: string;
  vote_average: number;
  last_episode_to_air: {
    name: string;
    runtime: number;
    air_date: string;
    season_number: number;
  };
  origin_country: [string];
  status: string;
}

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
      vote_average: number;
    }
  ];
}

interface CastProps {
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
    endpoint: `${process.env.NEXT_PUBLIC_VIDSRC_API}/tv`,
  },
  {
    id: 2,
    name: "Server 2",
    disabled: false,
    endpoint: `${process.env.NEXT_PUBLIC_VIDSRC2_API}/tv`,
  },
  {
    id: 3,
    name: "Server 3",
    disabled: true,
    endpoint: `${process.env.NEXT_PUBLIC_SMASHY_API}/tv`,
  },
];

export default function TvDetail({
  specific,
  showVideo,
}: {
  specific?: string;
  showVideo?: boolean;
}) {
  const movie_id = useSearchParams().get("id");
  const [data, setData] = useState<DataType | null>(null);
  const [dataEpisode, setDataEpisode] = useState<EpisodeType | null>(null);
  const [dataCast, setDataCast] = useState<CastProps | null>(null);
  const [isWatch, setIsWatch] = useState(showVideo || false);
  const [season, setSeason] = useState(1);
  const [switchServer, setSwitchServer] = useState(2);
  const getParams = useParams().slug?.toString();

  const match = getParams?.match(/season-(\d+)-episode-(\d+)/);
  const season_number = match && match[1];
  const episode_number = match && match[2];

  const supabase = createClient();

  const [form, setForm] = useState({
    name: "",
    comment: "",
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [msgLength, setMsgLength] = useState(1000);
  const [comments, setComments] = useState<
    Array<{
      id: number;
      movie_id: number;
      username: string;
      message: string;
      created_at: string;
    }>
  >([]);

  // const stream_url = process.env.NEXT_PUBLIC_VIDSRC_API + "/tv";
  const stream_url = servers
    .filter((item) => item.id === switchServer)
    .map((e) => e.endpoint);

  useEffect(() => {
    // API TV Detail
    axios
      .get(`/api/tmdb/tv/${movie_id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));

    // API TV Episode by Season
    axios
      .get(`/api/tmdb/tv/${movie_id}/season/${season}`)
      .then((res) => setDataEpisode(res.data))
      .catch((err) => console.error(err));

    // API Cast
    axios
      .get(`/api/tmdb/tv/${movie_id}/credits`)
      .then((res) => setDataCast(res.data))
      .catch((err) => console.error(err));
  }, [movie_id, season]);

  const slugify = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTextArea = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const input = e.target.value;
    setMsgLength(1000 - input.length);
    setForm({ ...form, comment: input });

    if (input.length > 1000) {
      setMsgLength(0);
      setForm({ ...form, comment: input.slice(0, 1000) });
    }

    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 120) + "px";
  };

  const scrollToPlayer = () => {
    setIsWatch(true);

    const player = document.getElementById("player");
    if (player) {
      player.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, name: e.target.value });
  };

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name === "" || form.comment === "") return;

    try {
      await supabase.from("comments").insert([
        {
          movie_id: Number(movie_id),
          username: form.name,
          message: form.comment,
          type: "tv",
        },
      ]);
      setForm({ name: "", comment: "" });
      setMsgLength(1000);
      getComments();
    } catch (err) {
      console.error(err);
    }
  };

  const getComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("movie_id", movie_id)
        .eq("type", "tv")
        .order("id", { ascending: false });
      if (error) {
        console.error("Supabase insert error:", error.message, error.details);
      } else {
        setComments(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getComments();
  });

  if (!data) return <TVDetailSkeleton />;

  return (
    <div className="py-20 flex flex-col space-y-10">
      <div className="flex gap-5 pb-4">
        {/* Movie Info */}
        <div className="relative w-full md:h-[75vh] h-[80vh]">
          <Image
            src={`https://image.tmdb.org/t/p/original/${data?.backdrop_path}`}
            fill
            alt={`${data?.name}`}
            unoptimized
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 gap-10 bg-gradient-to-t from-background to-transparent w-full h-full">
            <div className="absolute bottom-4 left-4 flex flex-col md:flex-row gap-5">
              <Image
                src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`}
                width={130}
                height={130}
                alt={`${data?.name}`}
                unoptimized
                className="w-36 md:w-52 h-auto object-cover rounded-xl"
              />
              <div className="flex flex-col space-y-4">
                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold">
                  {data?.original_language === "id"
                    ? data?.original_name
                    : data?.name}
                </h1>
                {/* Rating */}
                <div className="flex gap-2 items-center">
                  <span className="text-sm flex items-center gap-2">
                    <Star fill="gold" stroke="none" size={16} />
                    <p className="opacity-50">
                      {data?.vote_average.toFixed(1)} / 10
                    </p>
                  </span>
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">
                    {data?.number_of_seasons} Season
                  </p>
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">
                    {data?.origin_country[0]}
                  </p>
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">
                    {data?.first_air_date.split("-")[0]}
                  </p>
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">{data?.status}</p>
                </div>

                {/* Synopsis */}
                <p className="opacity-50 font-sans md:w-3/4">
                  {data?.overview}
                </p>
                {/* Watch Button */}
                <button
                  onClick={scrollToPlayer}
                  className="flex gap-2 items-center justify-center border border-red-500 bg-red-600 hover:bg-red-700 rounded-lg p-2 cursor-pointer w-36 font-semibold text-sm h-11 transition-all ease-in-out duration-300"
                >
                  <Play size={16} fill="white" stroke="none" /> Watch Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        {/* Player */}
        <div id="player">
          {isWatch && (
            <div>
              <div className="mb-4">
                <select className="select select-ghost rounded-md bg-background border border-red-500 w-40 p-2">
                  {servers.map((server) => (
                    <option
                      key={server.id}
                      value={server.id}
                      disabled={server.disabled}
                      onClick={() => setSwitchServer(server.id)}
                      className="hover:bg-red-500"
                    >
                      {server.name}
                    </option>
                  ))}
                </select>
              </div>
              <iframe
                loading="lazy"
                src={
                  !specific
                    ? `${stream_url}/${movie_id}?autoPlay=false`
                    : `${stream_url}/${movie_id}/${specific}?autoPlay=false`
                }
                title="Movie player"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="no-referrer"
                // sandbox="allow-scripts allow-same-origin"
                className="flex w-full h-[315px] md:h-screen"
              ></iframe>
            </div>
          )}
        </div>
        {/* Seasons */}
        <div className="flex flex-col space-y-6 my-4">
          <div className="flex flex-wrap gap-4 items-center">
            {[...Array(data?.number_of_seasons)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setSeason(i + 1)}
                className={`${
                  season === i + 1 ? "bg-red-500 text-white scale-101" : ""
                } border border-red-500 py-1 px-2 rounded-sm text-red-500 hover:bg-red-500 hover:text-white`}
              >
                Season {i + 1}
              </button>
            ))}
          </div>

          {/* Episode */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 space-y-4">
            {dataEpisode?.episodes.map((item) => {
              if (!item.still_path) return;

              return (
                <Link
                  href={`/episode/${slugify(data?.name as string)}-season-${
                    item.season_number
                  }-episode-${item.episode_number}?id=${movie_id}`}
                  // onClick={scrollToPlayer}
                  key={item.id}
                  className="flex flex-col w-full md:h-[170px] gap-2 items-center rounded-md hover:cursor-pointer"
                >
                  <div
                    className={`${
                      Number(season_number) == Number(item.season_number) &&
                      Number(episode_number) == Number(item.episode_number)
                        ? "border-2 border-red-600 group-text-red-500"
                        : ""
                    } relative w-full hover:scale-105 transition-all ease-in-out duration-200 rounded-md`}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.still_path}`}
                      width={100}
                      height={100}
                      alt={`${data?.name}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute w-full h-full inset-0 bg-gradient-to-t from-background/70 to-transparent rounded-md">
                      <div className="absolute top-0 p-0.5 flex justify-between w-full">
                        <p className="text-xs bg-black px-2 py-0.5 rounded-sm font-semibold">
                          S
                          {Number(item.season_number) < 10
                            ? `0${item.season_number}`
                            : item.season_number}
                          E
                          {Number(item.episode_number) < 10
                            ? `0${item.episode_number}`
                            : item.episode_number}
                        </p>
                        <p className="text-xs bg-black px-2 pu-0.5 rounded-sm">
                          {item.air_date &&
                            new Intl.DateTimeFormat("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                              .format(new Date(item.air_date))
                              .split(" ")
                              .join(" ")}
                        </p>
                      </div>
                      <div className="absolute bottom-0 p-0.5 flex justify-between w-full">
                        <span className="text-xs flex items-center gap-1 bg-black px-2 py-0.5 rounded-sm">
                          <Star fill="gold" stroke="none" size={14} />
                          <p className="text-yellow-300 font-semibold">
                            {item?.vote_average.toFixed(1)}
                          </p>
                        </span>
                        <p className="text-xs bg-black px-2 py-0.5 rounded-sm font-semibold">
                          {item.runtime}min
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1
                      className={`${
                        Number(season_number) == Number(item.season_number) &&
                        Number(episode_number) == Number(item.episode_number)
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      Episode {item.episode_number}
                    </h1>

                    <p className="text-xs opacity-50 line-clamp-2">
                      {item.overview}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        {/* Cast */}
        <h1 className="text-2xl font-semibold mb-4 border-l-4 border-red-500 px-2">
          Cast
        </h1>
        <div className="flex overflow-x-auto space-x-5 md:space-x-10 no-scrollbar">
          {dataCast?.cast.map((cast) => (
            <div
              key={cast.id}
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
              className="flex gap-4 border border-red-500/50 p-4 rounded-lg"
            >
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
                    }).format(new Date(comment.created_at))}
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
