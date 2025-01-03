"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ChevronDown, Moon } from "lucide-react";
import { Sun } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { GetCreditsDialog } from "./GetCreditsDialog";
import Image from "next/image";

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
  const { setTheme, theme } = useTheme();
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);

  return (
    <header className="w-full border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href={"/app"}>
            <Image
              src="/icon.svg"
              alt="Faceless Avatar Logo"
              className="rounded-lg h-12 w-12"
              width={50}
              height={50}
            />
          </Link>
          <nav className="flex items-center gap-4 md:gap-10 sm:gap-6 text-xl m1100:text-base">
            <Link
              className="font-base hover:opacity-70 transition-opacity"
              href="/app"
            >
              Generate
            </Link>
            <Link
              className="font-base hover:opacity-70 transition-opacity"
              href="/app/packs"
            >
              Packs
            </Link>
            <Link
              className="font-base hover:opacity-70 transition-opacity"
              href="/app/credits"
            >
              Get Credits
            </Link>
            {user.email === "mrlol.yt.oficial@gmail.com" && (
              <Link
                className="font-base hover:opacity-70 transition-opacity"
                href="/admin/codes"
              >
                Create Codes
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4 sm:gap-2">
          <Badge
            variant="default"
            className="text-sm flex items-center gap-1 cursor-pointer hover:opacity-90 active:scale-95 transition-all select-none"
            onClick={() => setShowCreditsDialog(true)}
          >
            <span className="font-heading">{credits}</span>
            <span className="text-xs hidden md:block">Credits</span>
            <span className="text-xs block md:hidden">c</span>
            <ChevronDown className="h-4 w-4" />
          </Badge>

          <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
            <GetCreditsDialog />
          </Dialog>

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
              <DropdownMenuItem className="sm:hidden" onClick={() => null}>
                <span className="font-heading mr-2">{credits}</span>
                Credits
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? (
                  <>
                    <Moon className="h-6 w-6 m500:h-4 m500:w-4 inline dark:hidden stroke-text" />{" "}
                    Dark
                  </>
                ) : (
                  <>
                    <Sun className="h-6 w-6 m500:h-4 m500:w-4 hidden dark:inline stroke-darkText" />{" "}
                    Light
                  </>
                )}
              </DropdownMenuItem>
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
