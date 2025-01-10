import { serviceRole } from "./supabase/service-role";

export const updateCredits = async (
  userId: string,
  amount: number,
  type: string
) => {
  const { data: creditsData, error: creditsError } = await serviceRole
    .from("faceless_credits")
    .select("*")
    .eq("userId", userId)
    .single();

  if (creditsError) {
    throw new Error("Error fetching credits");
  } else {
    // Update credits
    const { error: updateError, data: updatedCredits } = await serviceRole
      .from("faceless_credits")
      .update({
        actual: creditsData.actual + amount,
        transactions: [
          ...(creditsData.transactions || []),
          {
            type: type,
            amount: amount,
            createdAt: new Date().toISOString(),
          },
        ],
      })
      .eq("userId", userId)
      .select()
      .single();

    if (updateError) {
      throw new Error("Error updating credits");
    }
    return {
      credits: updatedCredits,
    };
  }
};
