"use client";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Crown, Play, Star, User } from "lucide-react";
import TVDetailSkeleton from "./TVDetailSkeleton";
import { addComments, getComments } from "../actions/addComments";
import { toast } from "react-toastify";
import { CommentType } from "@/types/commentType";
import { useUserStore } from "@/zustand/userStore";
import { recordWatchHistory } from "@/app/actions/watchHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveLocalWatchHistory } from "@/lib/localWatchHistory";
import AdsBanner from "./AdsBanner";

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
  runtime: number;
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
    isPremium: false,
    endpoint: `${process.env.NEXT_PUBLIC_VIDSRC_API}/tv`,
  },
  {
    id: 2,
    name: "Server 2",
    disabled: false,
    isPremium: false,
    endpoint: `${process.env.NEXT_PUBLIC_VIDSRC2_API}/tv`,
  },
  {
    id: 3,
    name: "Server 3",
    disabled: false,
    isPremium: true,
    endpoint: `${process.env.NEXT_PUBLIC_VIDSRC3_API}/tv`,
  },
];

// Throttle: progress paling cepat ter-update tiap 15 detik (kecuali saat pause, dipaksa save)
const PROGRESS_THROTTLE_MS = 15000;

export default function TvDetail({
  tv,
  specific,
  showVideo,
}: {
  tv: DataType;
  specific?: string;
  showVideo?: boolean;
}) {
  const searchParams = useSearchParams();
  const movie_id = searchParams.get("id");

  const { user } = useUserStore();

  const [dataEpisode, setDataEpisode] = useState<EpisodeType | null>(null);
  const dataEpisodeRef = useRef(dataEpisode);
  useEffect(() => {
    dataEpisodeRef.current = dataEpisode;
  }, [dataEpisode]);

  // saveWatchHistory dibungkus useCallback supaya bisa aman dipakai sebagai dependency effect,
  // dan selalu baca `user` terbaru (tidak stale di closure listener postMessage)
  const saveWatchHistory = useCallback(
    (payload: {
      movie_id: string;
      title: string;
      poster_path: string;
      backdrop_path?: string;
      category: "movie" | "tv";
      server: number;
      season_number?: number;
      episode_number?: number;
      progress?: number;
      duration?: number;
    }) => {
      const currentEp = dataEpisodeRef.current?.episodes?.find(
        (e) => Number(e.episode_number) === (payload.episode_number ?? 1)
      );
      const epRuntimeMinutes = currentEp?.runtime || tv?.runtime;
      const fallbackDurationSeconds = epRuntimeMinutes ? epRuntimeMinutes * 60 : undefined;

      const finalDuration =
        payload.duration && payload.duration > 0
          ? payload.duration
          : fallbackDurationSeconds;

      const finalPayload = {
        ...payload,
        duration: finalDuration,
      };

      if (user) {
        // User login -> simpan ke database
        recordWatchHistory(finalPayload);
      } else {
        // Guest -> simpan ke localStorage
        saveLocalWatchHistory({
          movieId: finalPayload.movie_id,
          title: finalPayload.title,
          posterPath: finalPayload.poster_path,
          backdropPath: finalPayload.backdrop_path ?? null,
          category: finalPayload.category,
          server: finalPayload.server,
          seasonNumber: finalPayload.season_number ?? null,
          episodeNumber: finalPayload.episode_number ?? null,
          progress: finalPayload.progress ?? null,
          duration: finalPayload.duration ?? null,
        });
      }
    },
    [user, tv]
  );
  const [dataCast, setDataCast] = useState<CastProps | null>(null);
  const [isWatch, setIsWatch] = useState(showVideo || false);
  const [season, setSeason] = useState(1);

  // Ambil server dari query string kalau ada (misal redirect dari watch history)
  const initialServer = searchParams.get("server");
  const [switchServer, setSwitchServer] = useState(
    initialServer ? Number(initialServer) : 2
  );
  const [isServerLoading, setIsServerLoading] = useState(false);

  const getParams = useParams().slug?.toString();

  const match = getParams?.match(/season-(\d+)-episode-(\d+)/);
  const season_number = match && match[1];
  const episode_number = match && match[2];

  const [form, setForm] = useState({
    comment: "",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [msgLength, setMsgLength] = useState(500);
  const [comments, setComments] = useState<CommentType[]>([]);

  // Ref untuk throttle progress update, dan ref switchServer/season supaya listener selalu baca value terbaru
  const lastSavedRef = useRef<number>(0);
  const switchServerRef = useRef(switchServer);
  const seasonRef = useRef(season);

  useEffect(() => {
    switchServerRef.current = switchServer;
  }, [switchServer]);

  useEffect(() => {
    seasonRef.current = season;
  }, [season]);

  // Sinkronkan state `season` dengan season_number dari URL saat pertama buka halaman episode,
  // supaya daftar episode yang ditampilkan sesuai season yang sedang ditonton
  useEffect(() => {
    if (season_number) {
      setSeason(Number(season_number));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stream_url = servers
    .filter((item) => item.id === switchServer)
    .map((e) => e.endpoint);

  const userNotPremium = () => {
    return !user || (user.role !== "premium" && user.role !== "admin");
  };

  useEffect(() => {
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

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.comment === "") return;

    try {
      const res = await addComments({
        movie_id: String(tv.id),
        title: tv.name || "",
        message: form.comment,
        category: "tv",
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setForm({ comment: "" });
      setMsgLength(500);
      const updated = await getComments(String(tv.id));
      setComments(updated);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComments(String(tv.id));

        setComments(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [tv.id]);

  // Auto-save history + buka player kalau masuk lewat klik episode (halaman /episode/[slug])
  // atau lewat tombol Watch Now (showVideo true dari server, atau specific ada isinya)
  useEffect(() => {
    if (!showVideo && !specific) return;

    setIsWatch(true);

    saveWatchHistory({
      movie_id: String(movie_id),
      title: tv.name || tv.original_name,
      poster_path: tv.poster_path,
      backdrop_path: tv.backdrop_path,
      category: "tv",
      server: switchServerRef.current,
      season_number: Number(season_number) || seasonRef.current,
      episode_number: Number(episode_number) || undefined,
    });

    const timeout = setTimeout(() => {
      const player = document.getElementById("player");
      player?.scrollIntoView({ behavior: "smooth" });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sekali saat mount, representasi "baru buka halaman episode/watch ini"

  // Event progress watch history dari player (postMessage)
  useEffect(() => {
    const saveProgress = (
      currentTime: number,
      duration: number | undefined,
      force = false
    ) => {
      const now = Date.now();
      if (!force && now - lastSavedRef.current < PROGRESS_THROTTLE_MS) return;
      lastSavedRef.current = now;

      const validDuration = duration && duration > 0 ? Math.floor(duration) : undefined;

      saveWatchHistory({
        movie_id: String(movie_id),
        title: tv?.name || tv?.original_name || "",
        poster_path: tv?.poster_path ?? "",
        backdrop_path: tv?.backdrop_path,
        category: "tv",
        server: switchServerRef.current,
        season_number: Number(season_number) || seasonRef.current,
        episode_number: Number(episode_number) || undefined,
        progress: Math.floor(currentTime),
        duration: validDuration,
      });
    };

    const handleMessage = (event: MessageEvent) => {
      let payload = event.data;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          // not JSON
        }
      }

      if (!payload || typeof payload !== "object") return;

      const eventType = String(
        payload.type || payload.event || payload.name || ""
      ).toLowerCase();

      const rawCurrentTime =
        payload.currentTime ??
        payload.time ??
        payload.position ??
        payload.seconds ??
        payload.current_time;

      const rawDuration =
        payload.duration ??
        payload.videoDuration ??
        payload.totalTime ??
        payload.length;

      const currentTime =
        typeof rawCurrentTime === "number" && !isNaN(rawCurrentTime)
          ? rawCurrentTime
          : typeof rawCurrentTime === "string" && !isNaN(Number(rawCurrentTime))
          ? Number(rawCurrentTime)
          : null;

      const duration =
        typeof rawDuration === "number" && !isNaN(rawDuration) && rawDuration > 0
          ? rawDuration
          : typeof rawDuration === "string" && !isNaN(Number(rawDuration)) && Number(rawDuration) > 0
          ? Number(rawDuration)
          : undefined;

      if (currentTime === null) return;

      if (
        eventType.includes("pause") ||
        eventType.includes("ended") ||
        eventType === "pause"
      ) {
        saveProgress(currentTime, duration, true);
      } else if (
        eventType.includes("time") ||
        eventType.includes("progress") ||
        eventType.includes("update") ||
        eventType === "player_time_update" ||
        eventType === ""
      ) {
        saveProgress(currentTime, duration, false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    episode_number,
    movie_id,
    season_number,
    tv.name,
    tv.original_name,
    tv.poster_path,
    tv.backdrop_path,
    saveWatchHistory,
  ]);

  const scrollToPlayer = () => {
    setIsWatch(true);

    saveWatchHistory({
      movie_id: String(movie_id),
      title: tv.name || tv.original_name,
      poster_path: tv.poster_path,
      backdrop_path: tv.backdrop_path,
      category: "tv", // FIX: sebelumnya salah kirim "movie"
      server: switchServer,
      season_number: Number(season_number) || season,
      episode_number: Number(episode_number) || undefined,
    });

    const player = document.getElementById("player");
    player?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-buka player kalau datang dari watch history (?autoplay=true)
  useEffect(() => {
    const shouldAutoplay = searchParams.get("autoplay") === "true";
    if (!shouldAutoplay) return;

    setIsWatch(true);

    const timeout = setTimeout(() => {
      const player = document.getElementById("player");
      player?.scrollIntoView({ behavior: "smooth" });
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchParams]);

  useEffect(() => {
    if (!comments.length) return;

    const id = window.location.hash.replace("#", "");

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  }, [comments]);

  if (!tv) return <TVDetailSkeleton />;

  return (
    <div className="py-20 flex flex-col space-y-10">
      <div className="flex gap-5 pb-4">
        {/* Movie Info */}
        <div className="relative w-full md:h-[75vh] h-[80vh]">
          <Image
            src={`https://image.tmdb.org/t/p/w1280/${tv.backdrop_path}`}
            fill
            alt={`${tv.name}`}
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 gap-10 bg-gradient-to-t from-background to-transparent w-full h-full">
            <div className="absolute bottom-4 left-4 flex flex-col md:flex-row gap-5">
              <Image
                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                width={130}
                height={130}
                alt={`${tv.name}`}
                sizes="(max-width: 768px) 150px, 208px"
                className="w-36 md:w-52 h-auto object-cover rounded-xl"
              />
              <div className="flex flex-col space-y-4">
                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold">
                  {tv.original_language === "id" ? tv.original_name : tv.name}
                </h1>
                {/* Rating */}
                <div className="flex gap-2 items-center">
                  <span className="text-sm flex items-center gap-2">
                    <Star fill="gold" stroke="none" size={16} />
                    <p className="opacity-50">
                      {tv.vote_average.toFixed(1)} / 10
                    </p>
                  </span>
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">
                    {tv.number_of_seasons} Season
                  </p>
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">{tv.origin_country[0]}</p>
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">
                    {tv.first_air_date.split("-")[0]}
                  </p>
                  <span className="text-xs">·</span>
                  <p className="opacity-50 text-sm">{tv.status}</p>
                </div>

                {/* Synopsis */}
                <p className="opacity-50 font-sans md:w-3/4">{tv.overview}</p>
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
                {/* Server Selector */}
                <Select
                  value={String(switchServer)}
                  onValueChange={(value) => {
                    const newServer = Number(value);
                    setSwitchServer(newServer);
                    setIsServerLoading(true);

                    // Simpan server terpilih ke history juga
                    // FIX: kirim newServer, bukan switchServer (state lama, belum ter-update saat closure ini dibuat)
                    saveWatchHistory({
                      movie_id: String(movie_id),
                      title: tv.name || tv.original_name,
                      poster_path: tv.poster_path,
                      backdrop_path: tv.backdrop_path,
                      category: "tv",
                      server: newServer,
                      season_number: Number(season_number) || season,
                      episode_number: Number(episode_number) || undefined,
                    });
                  }}
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
              </div>
              <div className="relative w-full h-[315px] md:h-screen">
                {isServerLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 text-white bg-black">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-red-500" />
                      <span className="text-sm font-medium tracking-wide">
                        LOADING SERVER {switchServer}
                      </span>
                    </div>
                  </div>
                )}
                <iframe
                  key={switchServer}
                  ref={iframeRef}
                  loading="lazy"
                  src={
                    !specific
                      ? `${stream_url}/${movie_id}/${season ?? 1}/${
                          episode_number ?? 1
                        }`
                      : `${stream_url}/${movie_id}/${specific}`
                  }
                  title="Movie player"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="no-referrer"
                  // sandbox="allow-scripts allow-same-origin"
                  className="flex w-full h-[315px] md:h-screen"
                  onLoad={() => setIsServerLoading(false)}
                ></iframe>
              </div>
            </div>
          )}
          {/* Ads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center animate-pulse">
          <AdsBanner
            adKey="11dc30a983c4986cbec90d0d54c60371"
            width={728}
            height={80}
          />
          <AdsBanner
            adKey="11dc30a983c4986cbec90d0d54c60371"
            width={728}
            height={80}
          />
        </div>
        </div>
        {/* Seasons */}
        <div className="flex flex-col space-y-6 my-4">
          <div className="flex flex-wrap gap-4 items-center">
            {[...Array(tv.number_of_seasons)].map((_, i) => (
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
                  href={`/episode/${slugify(tv.name as string)}-season-${
                    item.season_number
                  }-episode-${item.episode_number}?id=${movie_id}`}
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
                      src={`https://image.tmdb.org/t/p/w300${item.still_path}`}
                      width={100}
                      height={100}
                      alt={`${tv.name}`}
                      sizes="(max-width: 768px) 50vw, 16vw"
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
                  src={`https://image.tmdb.org/t/p/w185${cast.profile_path}`}
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
          {comments.map((comment) => (
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}