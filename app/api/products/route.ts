import { api } from "@/lib/polar";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await api.products.list({
      limit: 100,
    });
    return NextResponse.json(products.result.items);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
