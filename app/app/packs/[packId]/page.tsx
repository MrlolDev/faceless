import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import PackPage from "@/components/platform/Packs/PackPage";

export default async function PrivatePage(props: { params: any }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <PackPage packId={params.packId} />;
}
