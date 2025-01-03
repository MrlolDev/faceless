import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { type NextRequest, NextResponse } from "next/server";
import { serviceRole } from "@/lib/supabase/service-role";
import { WebhookCheckoutUpdatedPayload } from "@polar-sh/sdk/models/components";
import { Transaction } from "@/types/credits";

// Handler for checkout.updated events
async function handleCheckoutUpdated(
  checkoutData: WebhookCheckoutUpdatedPayload
) {
  const product = checkoutData.data.product;
  const { userId, credits } = checkoutData.data.customerMetadata as {
    userId: string;
    credits: number;
  };

  if (!userId || !credits) {
    throw new Error("Missing required metadata: userId or credits");
  }

  // Get user's current credits
  const { data: creditsData, error: creditsError } = await serviceRole
    .from("credits")
    .select("*")
    .eq("userId", userId)
    .single();

  if (creditsError) {
    throw new Error(`Failed to fetch credits: ${creditsError.message}`);
  }
  if (product.prices[0].amountType == "free") {
    const alreaydHadFreeTrial = creditsData.transactions?.some(
      (transaction: Transaction) => transaction.type == "free"
    );
    if (alreaydHadFreeTrial) {
      return;
    }
  }
  // Update user's credits
  const { error: updateError } = await serviceRole
    .from("credits")
    .update({
      actual: creditsData.actual + credits,
      transactions: [
        ...(creditsData.transactions || []),
        {
          type: product.prices[0].amountType == "free" ? "free" : "buy",
          amount: credits,
          createdAt: new Date().toISOString(),
          paymentMethod: "card",
        },
      ],
    })
    .eq("userId", userId);

  if (updateError) {
    throw new Error(`Failed to update credits: ${updateError.message}`);
  }

  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    // Validate webhook
    const requestBody = await request.text();
    const webhookHeaders = {
      "webhook-id": request.headers.get("webhook-id") ?? "",
      "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": request.headers.get("webhook-signature") ?? "",
    };

    const webhookPayload = validateEvent(
      requestBody,
      webhookHeaders,
      process.env.POLAR_WEBHOOK_SECRET!
    );

    console.log(webhookPayload);
    // Handle different webhook events
    switch (webhookPayload.type) {
      case "checkout.updated":
        await handleCheckoutUpdated(webhookPayload);
        break;
      default:
        console.warn(`Unhandled webhook event type: ${webhookPayload.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
