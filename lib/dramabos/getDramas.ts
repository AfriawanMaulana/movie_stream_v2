"use cache";

export const tags = ["dramabos"];

export async function getDramas(apiUrl: string, page?: number, limit?: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}${apiUrl}?page=${page}&limit=${limit}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Drama data");
  }

  return res.json();
}
