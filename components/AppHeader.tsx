"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export function AppHeader({
  user,
  signOut,
  credits,
}: {
  user: User;
  signOut: () => void;
  credits: number;
}) {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="w-full border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-heading">Faceless</h1>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-sm flex items-center gap-1">
            <span className="font-heading">{credits}</span>
            <span className="text-xs">Credits</span>
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={user.user_metadata.avatar_url} />
                <AvatarFallback>
                  {user.email?.split("@")[0].charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
