import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CodePage from "@/components/admin/CodePage";

export default async function AdminCodesPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || user.email !== "mrlol.yt.oficial@gmail.com") {
    redirect("/app");
  }

  return <CodePage />;
}
