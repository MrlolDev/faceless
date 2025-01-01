"use client";

import { useAuth } from "@/hooks/use-auth";
import Loading from "@/components/Loading";
import { AppHeader } from "@/components/platform/AppHeader";
import CodesForm from "@/components/admin/CodesForm";
import CodesTable from "@/components/admin/CodesTable";

export default function CodePage() {
  const { user, signOut, credits } = useAuth();

  if (!user) {
    return <Loading element="user" />;
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader user={user} signOut={signOut} credits={credits} />
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-heading mb-8">Create Codes</h1>
          <CodesForm />
        </div>
        <div>
          <h2 className="text-2xl font-heading mb-4">Active Codes</h2>
          <CodesTable />
        </div>
      </div>
    </div>
  );
}
