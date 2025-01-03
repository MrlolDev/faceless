import { api } from "@/lib/polar";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const productPriceId = url.searchParams.get("priceId") ?? "";
  const productId = url.searchParams.get("productId") ?? "";
  const confirmationUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/app/confirmation?checkout_id={CHECKOUT_ID}`;
  const product = await api.products.get({
    id: productId,
  });
  const credits = parseInt(product.benefits[0].description.split(" ")[0]);

  try {
    const result = await api.checkouts.custom.create({
      productPriceId,
      successUrl: confirmationUrl,
      allowDiscountCodes: true,
      customerEmail: user.email,
      metadata: {
        userId: user.id,
        credits: credits,
      },
    });

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
