import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "nature"; // Default to "nature" if no query
    const totalPages = 4;
    const perPage = 12;
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
      return NextResponse.json({ error: "Unsplash API key is missing" }, { status: 500 });
    }

    // Fetch all pages in parallel using Promise.all
    const fetchPromises = Array.from({ length: totalPages }, (_, i) =>
      fetch(
        `https://api.unsplash.com/search/photos?page=${i + 1}&query=${encodeURIComponent(query)}&client_id=${accessKey}&per_page=${perPage}`
      ).then((res) => res.json())
    );

    const responses = await Promise.all(fetchPromises);

    // Combine images from all pages
    const allImages = responses.flatMap((data) => data.results || []);

    return NextResponse.json({ results: allImages });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
