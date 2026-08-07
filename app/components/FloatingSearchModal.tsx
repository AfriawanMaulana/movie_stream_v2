"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Film, Tv, Star, Loader2, ArrowRight } from "lucide-react";
import { MovieItem } from "@/app/types";

interface FloatingSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slugify = (str?: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const getItemUrl = (item: MovieItem) => {
  const isTv = (item as unknown as { media_type?: string }).media_type === "tv";
  const category = isTv ? "tv" : "movie";
  const rawTitle =
    item.original_language === "id"
      ? item.original_title || item.original_name || item.title || item.name
      : item.title || item.name || item.original_title || item.original_name;

  const slug = slugify(rawTitle) || "title";
  return `/${category}/${slug}?id=${item.id}`;
};

export default function FloatingSearchModal({
  isOpen,
  onClose,
}: FloatingSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback(
    (url: string) => {
      router.push(url);
      onClose();
    },
    [router, onClose]
  );

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Live debounced search API call
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          fetch(`/api/tmdb/search/movie?query=${encodeURIComponent(query)}&page=1`),
          fetch(`/api/tmdb/search/tv?query=${encodeURIComponent(query)}&page=1`),
        ]);

        const movieData = await movieRes.json();
        const tvData = await tvRes.json();

        const movies = (movieData?.results || []).slice(0, 4).map((item: MovieItem) => ({
          ...item,
          media_type: "movie",
        }));
        const tvs = (tvData?.results || []).slice(0, 4).map((item: MovieItem) => ({
          ...item,
          media_type: "tv",
        }));

        // Interleave movies and tv shows
        const combined: MovieItem[] = [];
        const maxLen = Math.max(movies.length, tvs.length);
        for (let i = 0; i < maxLen; i++) {
          if (movies[i]) combined.push(movies[i]);
          if (tvs[i]) combined.push(tvs[i]);
        }

        setResults(combined);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard accessibility (ESC to close, Arrow keys, Enter to navigate)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          const item = results[selectedIndex];
          handleNavigate(getItemUrl(item));
        } else if (query.trim()) {
          handleNavigate(`/search?query=${encodeURIComponent(query)}`);
        }
      }
    },
    [onClose, results, selectedIndex, query, handleNavigate]
  );


  if (!isOpen) return null;

  return (
   <div
    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center pt-16 md:pt-24 px-4 transition-all duration-300 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        onKeyDown={handleKeyDown}
        className="w-full max-w-2xl bg-[#141414] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
      >
        {/* Floating Search Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3 bg-[#1c1c1c]">
          <Search className="w-5 h-5 text-red-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            placeholder="Search movies, TV shows, anime..."
            className="w-full bg-transparent text-white placeholder-white/40 text-base md:text-lg focus:outline-none"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-red-500 animate-spin shrink-0" />
          ) : query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-white/40 border border-white/15 rounded-md hover:text-white hover:border-white/30 transition-all shrink-0 hidden sm:block"
          >
            ESC
          </button>
        </div>

        {/* Floating Results Popup Area */}
        <div className="overflow-y-auto p-3 space-y-2 max-h-[60vh] scrollbar-thin scrollbar-thumb-white/10">
          {!query.trim() ? (
            <div className="py-10 text-center space-y-2">
              <Film className="w-10 h-10 mx-auto text-white/20" />
              <p className="text-sm text-white/40 font-medium">
                Type a title to search instant results...
              </p>
            </div>
          ) : loading && results.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Loader2 className="w-8 h-8 mx-auto text-red-500 animate-spin" />
              <p className="text-sm text-white/50">Searching TMDB library...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-base text-white/70 font-semibold">
                No results found for &quot;{query}&quot;
              </p>
              <p className="text-xs text-white/40">
                Try searching with a different keyword or title.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const title = item.title || item.name || item.original_title || item.original_name;
                const isTv = (item as unknown as { media_type?: string }).media_type === "tv";
                const releaseYear = (item.release_date || item.first_air_date || "").slice(0, 4);
                const isSelected = idx === selectedIndex;
                const targetUrl = getItemUrl(item);

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNavigate(targetUrl);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3.5 p-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-red-600/20 border border-red-500/40"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {/* Thumbnail Poster */}
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                          alt={title || "Poster"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          {isTv ? <Tv size={20} /> : <Film size={20} />}
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                            isTv
                              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {isTv ? "TV Series" : "Movie"}
                        </span>
                        {releaseYear && (
                          <span className="text-xs text-white/40">{releaseYear}</span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-white truncate mt-1">
                        {title}
                      </h4>
                      {item.vote_average ? (
                        <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{item.vote_average.toFixed(1)}</span>
                        </div>
                      ) : null}
                    </div>

                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? "text-red-500 translate-x-1" : "text-white/20"}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Link to Full Results Page */}
        {query.trim() && (
          <div className="p-3 bg-[#1a1a1a] border-t border-white/10 text-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigate(`/search?query=${encodeURIComponent(query)}`);
              }}
              className="text-xs font-semibold text-red-500 hover:text-red-400 flex items-center justify-center gap-1.5 mx-auto transition-all cursor-pointer"
            >
              <span>View all search results for &quot;{query}&quot;</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
