"use client";

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
import { ThemeSwitcher } from "./ThemeSwitcher";
import Link from "next/link";

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
        <div className="flex items-center gap-10">
          <Link
            className="text-[30px] h-11 w-11 rounded-base flex bg-main text-text border-2 border-black m500:w-9 m500:h-9 m500:text-[22px] items-center justify-center font-heading"
            href={"/app"}
          >
            F
          </Link>
          <Link className="text-xl m1100:text-base font-base" href="/app">
            Generate
          </Link>
          <Link className="text-xl m1100:text-base font-base" href="/app/packs">
            Packs
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-sm flex items-center gap-1">
            <span className="font-heading">{credits}</span>
            <span className="text-xs">Credits</span>
          </Badge>
          <ThemeSwitcher />

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
