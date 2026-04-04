"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";
import Link from "next/link";

interface DataProps {
  id: number;
  backdrop_path: string;
  title: string;
  original_title: string;
  overview: string;
}

export default function Carousel({ data }: { data: [] }) {
  const slugify = (str?: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  return (
    <div className="w-full max-w-full h-auto mt-2 mx-auto">
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
        className="rounded-3xl"
      >
        {data.map((item: DataProps) => (
          <SwiperSlide
            key={item.id}
            className="group relative hover:cursor-pointer"
          >
            <Link href={`/movie/${slugify(item.title)}?id=${item.id}`}>
              <div className="relative w-full h-[30vh] md:h-[70vh]">
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

              <div className="absolute inset-0 flex flex-col justify-end px-4 py-6 bg-gradient-to-t from-black via-black/50 to-transparent">
                <h1 className="font-black text-xl md:text-4xl lg:text-5xl max-w-[50%] line-clamp-2">
                  {item.title}
                </h1>
                <p className="text-xs md:text-sm italic font-semibold max-w-[50%] line-clamp-2 opacity-75">
                  {`"${item.overview}"`}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
