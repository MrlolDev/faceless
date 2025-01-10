import { api } from "@/lib/polar";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Transaction } from "@/types/credits";
import { verifyTurnstileToken } from "@/lib/turnstile";

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
  const captchaToken = url.searchParams.get("captchaToken") ?? "";
  const confirmationUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}/app/confirmation?checkout_id={CHECKOUT_ID}`;
  const isCaptchaValid = await verifyTurnstileToken(captchaToken);

  if (!isCaptchaValid) {
    return NextResponse.json({ error: "Invalid captcha" }, { status: 400 });
  }

  const product = await api.products.get({
    id: productId,
  });
  const credits = parseInt(product.benefits[0].description.split(" ")[0]);

  // Check if this is a free trial and if user already had one
  if (product.prices[0].amountType === "free") {
    const { data: creditsData } = await supabase
      .from("faceless_credits")
      .select("*")
      .eq("userId", user.id)
      .single();

    const alreadyHadFreeTrial = creditsData?.transactions?.some(
      (transaction: Transaction) => transaction.type === "free"
    );

    if (alreadyHadFreeTrial) {
      return NextResponse.json(
        { error: "You've already used your free trial" },
        { status: 400 }
      );
    }
  }

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
