"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";

interface DataProps {
  id: number;
  backdrop_path: string;
  title: string;
  original_title: string;
  overview: string;
  vote_average: number;
  release_date: string;
  first_air_date: string;
  logo: string;
}

export default function Carousel({
  data,
  category,
}: {
  data: DataProps[];
  category: string;
}) {
  const slugify = (str?: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  return (
    <div className="w-full max-w-full h-auto mx-auto">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        // className="rounded-3xl"
      >
        {data.map((item: DataProps) => (
          <SwiperSlide key={item.id} className="group relative">
            <div className="relative w-full md:h-[95vh] h-[80vh]">
              {item.backdrop_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                  alt=""
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-all duration-300"
                />
              ) : (
                <div className="bg-black"></div>
              )}
            </div>

            <div className="absolute space-y-4 inset-0 flex flex-col justify-end px-5 md:px-14 py-10 bg-gradient-to-t from-background to-transparent">
              <div
                className={`w-24 font-semibold px-2 py-1 rounded-xs text-center ${
                  category === "movie" ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {category === "movie" ? "MOVIE" : "TV"}
              </div>
              {item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.title}
                  width={400}
                  height={200}
                  className="max-h-[80px] md:max-h-[100px] left-0 object-left object-contain drop-shadow-lg"
                />
              ) : (
                <h1 className="font-black text-xl md:text-4xl lg:text-5xl max-w-[50%] line-clamp-2">
                  {item.title}
                </h1>
              )}

              <div className="flex gap-2 items-center">
                <div className="flex gap-1 items-center text-[#FFC81E]">
                  <Star size={14} fill="#FFC81E" />{" "}
                  {item.vote_average.toFixed(1)}
                </div>
                <p className="text-md text-slate-400">
                  {(item.release_date || item.first_air_date) &&
                    new Intl.DateTimeFormat("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(
                      new Date(item.release_date || item.first_air_date!)
                    )}
                </p>
              </div>
              <p className="text-md md:text-lg italic w-full lg:max-w-[50%] line-clamp-2 opacity-75">
                {`"${item.overview}"`}
              </p>
              <Link
                href={`/movie/${slugify(item.title)}?id=${item.id}`}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-700 px-4 py-3 w-44 rounded-md text-center font-semibold text-xl transition-all duration-200 ease-in-out"
              >
                <Play size={20} /> Watch Now
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
