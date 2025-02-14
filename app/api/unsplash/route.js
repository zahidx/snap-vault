import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "nature";  // Default to "nature" if no query is provided
  const totalPages = 4;  // Specify how many pages you want to fetch, adjust based on your needs
  
  let allImages = [];
  
  // Fetch images for multiple pages
  for (let page = 1; page <= totalPages; page++) {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&per_page=12`
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
    }

    const data = await response.json();
    allImages = [...allImages, ...data.results]; // Combine images from each page
  }

  // Return the combined image data as a JSON response
  return NextResponse.json({ results: allImages });
}
