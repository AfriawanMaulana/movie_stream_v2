import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const { path } = await params;
    const searchParams = new URL(req.url).searchParams;
    const query = searchParams.toString()
    // const page = searchParams.get("page") || "1";

    const fullPath = path.join('/');
    const res = await fetch(`${process.env.TMDB_API}/${fullPath}?${query}`, {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        }
    })

    const data = await res.json();
    return NextResponse.json(data);
}