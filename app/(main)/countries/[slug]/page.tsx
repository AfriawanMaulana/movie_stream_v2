import { Suspense } from "react";
import MovieList from "@/app/components/MovieList";
import NotFound from "@/app/components/NotFound";
import GenreFilter from "./GenreFilter";
import { getMovies } from "@/lib/tmdb/getMovies";
import { getGenreId } from "@/lib/tmdb/getGenreId";

export const dynamic = "force-dynamic";

const language = {
  id: "id-ID",
};

const originalLanguage: Record<string, string> = {
  AE: "ar", // United Arab Emirates
  AR: "es", // Argentina
  AT: "de", // Austria
  AU: "en", // Australia
  BE: "fr", // Belgium (mostly French/Dutch, default fr)
  BG: "bg", // Bulgaria
  BR: "pt", // Brazil
  CA: "en", // Canada
  CH: "de", // Switzerland (mostly German)
  CL: "es", // Chile
  CO: "es", // Colombia
  CZ: "cs", // Czech Republic
  DE: "de", // Germany
  DK: "da", // Denmark
  EC: "es", // Ecuador
  EG: "ar", // Egypt
  ES: "es", // Spain
  FI: "fi", // Finland
  FR: "fr", // France
  GB: "en", // United Kingdom
  HK: "zh", // Hong Kong
  HR: "hr", // Croatia
  HU: "hu", // Hungary
  ID: "id", // Indonesia
  IE: "en", // Ireland
  IL: "he", // Israel
  IN: "hi", // India
  IQ: "ar", // Iraq
  IS: "is", // Iceland
  IT: "it", // Italy
  JP: "ja", // Japan
  KR: "ko", // South Korea
  NL: "nl", // Netherlands
  NZ: "en", // New Zealand
  PH: "tl", // Philippines
  PL: "pl", // Poland
  PT: "pt", // Portugal
  RO: "ro", // Romania
  RU: "ru", // Russia
  SA: "ar", // Saudi Arabia
  SG: "en", // Singapore
  TH: "th", // Thailand
  TR: "tr", // Turkey
  TW: "zh", // Taiwan
  US: "en", // United States
  UY: "es", // Uruguay
  ZA: "en", // South Africa
};

const certificationMap: Record<string, { country: string; max: string }> = {
  AE: { country: "US", max: "PG-13" }, // AE tidak ada di TMDB, fallback US
  AR: { country: "AR", max: "+13" }, // ATP, +13 (under 16)
  AT: { country: "DE", max: "12" }, // AT tidak ada di TMDB, fallback DE
  AU: { country: "AU", max: "M" }, // G, PG, M (under MA 15+)
  BE: { country: "US", max: "PG-13" }, // BE tidak ada di TMDB, fallback US
  BG: { country: "BG", max: "C" }, // A, B, C (under D=16+)
  BR: { country: "BR", max: "12" }, // L, 10, 12 (under 14)
  CA: { country: "CA", max: "PG" }, // E, G, PG (under 14A)
  CH: { country: "CH", max: "14" }, // 0,6,8,10,12,14 (under 16)
  CL: { country: "US", max: "PG-13" }, // CL tidak ada di TMDB, fallback US
  CO: { country: "US", max: "PG-13" }, // CO tidak ada di TMDB, fallback US
  CZ: { country: "US", max: "PG-13" }, // CZ tidak ada di TMDB, fallback US
  DE: { country: "DE", max: "12" }, // 0, 6, 12 (under 16)
  DK: { country: "DK", max: "11" }, // A, 7, 11 (under 15)
  EC: { country: "US", max: "PG-13" }, // EC tidak ada di TMDB, fallback US
  EG: { country: "US", max: "PG-13" }, // EG tidak ada di TMDB, fallback US
  ES: { country: "ES", max: "12" }, // A, Ai, 7, 7i, 12 (under 16)
  FI: { country: "FI", max: "K-12" }, // S, K-7, K-12 (under K-16)
  FR: { country: "FR", max: "12" }, // TP, 12 (under 16)
  GB: { country: "GB", max: "12A" }, // U, PG, 12A (under 15)
  HK: { country: "HK", max: "IIA" }, // I, IIA (under IIB)
  HR: { country: "US", max: "PG-13" }, // HR tidak ada di TMDB, fallback US
  HU: { country: "HU", max: "12" }, // KN, 6, 12 (under 16)
  ID: { country: "ID", max: "13+" }, // SU, 13+ (under 17+)
  IE: { country: "IE", max: "12A" }, // G, PG, 12A (under 15A)
  IL: { country: "IL", max: "14" }, // All, 12, 14 (under 16)
  IN: { country: "IN", max: "U/A 13+" }, // U, U/A 7+, UA, U/A 13+ (under U/A 16+)
  IQ: { country: "US", max: "PG-13" }, // IQ tidak ada di TMDB, fallback US
  IS: { country: "US", max: "PG-13" }, // IS tidak ada di TMDB, fallback US
  IT: { country: "IT", max: "14+" }, // T, 6+, 14+ (under 18+)
  JP: { country: "JP", max: "PG12" }, // G, PG12 (under R15+)
  KR: { country: "KR", max: "15" }, // All, 12, 15 (under 18)
  NL: { country: "NL", max: "12" }, // AL, 6, 9, 12 (under 14)
  NZ: { country: "NZ", max: "M" }, // G, PG, M (under R13)
  PH: { country: "PH", max: "PG" }, // G, PG (under R-13)
  PL: { country: "US", max: "PG-13" }, // PL tidak ada di TMDB, fallback US
  PT: { country: "PT", max: "M/12" }, // Públicos, M/3, M/6, M/12 (under M/14)
  RO: { country: "US", max: "PG-13" }, // RO tidak ada di TMDB, fallback US
  RU: { country: "RU", max: "12+" }, // 0+, 6+, 12+ (under 16+)
  SA: { country: "US", max: "PG-13" }, // SA tidak ada di TMDB, fallback US
  SG: { country: "SG", max: "PG13" }, // G, PG, PG13 (under NC16)
  TH: { country: "TH", max: "15" }, // P, G, 13, 15 (under 18)
  TR: { country: "TR", max: "13+" }, // Genel, 6A, 6+, 10A, 10+, 13A, 13+ (under 16+)
  TW: { country: "TW", max: "15+" }, // 0+, 6+, 12+, 15+ (under 18+)
  US: { country: "US", max: "PG-13" }, // G, PG, PG-13 (under R)
  UY: { country: "US", max: "PG-13" }, // UY tidak ada di TMDB, fallback US
  ZA: { country: "ZA", max: "10-12PG" }, // A, PG, 7-9PG, 10-12PG (under 13)
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; genre?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const region = slug;
  const page = Number(sp.page) || 1;
  const genreSlug = sp.genre;

  let genreId: number | undefined;

  if (genreSlug) {
    genreId = await getGenreId(genreSlug);
  }

  // const today = new Date().toISOString().split("T")[0]; &sort_by=primary_release_date.desc&release_date.lte=${today}
  const langCode = language[region as keyof typeof language] ?? "en-US";
  const originalLang =
    originalLanguage[region as keyof typeof originalLanguage] ?? region;
  const cert = certificationMap[region as keyof typeof certificationMap];

  const certParams = cert
    ? `&certification_country=${cert.country}&certification.lte=${cert.max}`
    : "";

  const movies = await getMovies(
    `/api/tmdb/discover/movie?region=${region.toUpperCase()}&include_adult=false&language=${langCode}&with_origin_country=${region.toUpperCase()}&with_original_language=${originalLang}${
      genreId ? `&with_genres=${genreId}` : ""
    }${certParams}`,
    page
  );

  if (movies.total_results === 0) {
    return <NotFound />;
  }

  return (
    <section className="px-5 lg:px-14 py-20 space-y-6">
      <Suspense fallback={null}>
        <GenreFilter />
      </Suspense>

      <MovieList data={movies} category="movie" header="Popular" isPagination />
    </section>
  );
}
