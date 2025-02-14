import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "nature";
  const page = searchParams.get("page") || 1;

  const response = await fetch(
    `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&per_page=12`
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
