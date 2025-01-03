import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import SuccessPage from "@/components/platform/Credits/SuccessPage";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <SuccessPage />;
}
