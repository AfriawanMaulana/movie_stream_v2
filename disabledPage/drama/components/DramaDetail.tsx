import { DramaDetailType } from "@/app/types";
import { getDramas } from "@/lib/dramabos/getDramas";
import Image from "next/image";
import Link from "next/link";

export default async function DramaDetail({
  id,
  ep,
}: {
  id: string;
  ep?: string;
}) {
  const slugify = (str?: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const data: DramaDetailType = await getDramas(
    `/api/dramabos/dotdrama/api/drama/${id}`
  );

  let detailEpisode = null;
  if (ep) {
    detailEpisode = await getDramas(
      `/api/dramabos/dotdrama/api/drama/${id}/${ep}`
    );
  }

  return (
    <div className="py-20 px-5 flex flex-col space-y-10">
      <div className="flex gap-5 border-b border-white/20 pb-4">
        <Image
          src={`${data.dgiv.bswitc.pday}`}
          width={130}
          height={130}
          alt={`${data?.dgiv.bswitc.nseri}`}
          priority
          unoptimized
          className="w-36 md:w-40 h-auto object-cover"
        />
        <h1 className="text-2xl md:text-3xl">{data?.dgiv.bswitc.nseri}</h1>
      </div>
      <p className="opacity-50 font-sans">{data.dgiv.bswitc.dwill}</p>
      {detailEpisode && detailEpisode.video_url && (
        <div>
          <iframe
            loading="lazy"
            src={`${detailEpisode.video_url}`}
            title="Drama player"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="no-referrer"
            className="flex w-full h-[315px] md:h-screen"
          ></iframe>
        </div>
      )}

      <div>
        <p>Episodes</p>
        <div className="flex w-full overflow-x-auto gap-2 custom-scrollbar">
          {data.dgiv.ebeer.map((item) => (
            <Link
              href={{
                pathname: `/drama/${slugify(data.dgiv.bswitc.nseri)}`,
                query: { id: data.dgiv.bswitc.dcup, ep: item.ewheel },
              }}
              key={item.ewheel}
              className={`${
                ep == item.ewheel
                  ? "border-red-500 text-red-500"
                  : "border-white/50 text-white/50"
              } flex flex-none items-center justify-center w-14 h-14 md:w-20 md:h-20 border rounded-md`}
            >
              <p>{item.ewheel}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
