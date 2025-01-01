import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import PacksPage from "@/components/platform/Packs/PacksPage";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <PacksPage />;
}
