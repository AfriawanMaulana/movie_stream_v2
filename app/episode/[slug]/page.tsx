'use client';

import Navbar from "@/app/components/Navbar";
import TvDetail from "@/app/components/TvDetail";
import { useParams } from "next/navigation";


export default function Page() {
    const params = useParams().slug?.toString();
    const match = params?.match(/season-(\d+)-episode-(\d+)/);
    const season_number = match && match[1];
    const episode_number = match && match[2];

    return (
        <div>
            <Navbar />
            <TvDetail specific={`${season_number}/${episode_number}`} />
        </div>
    )
}