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
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon } from "lucide-react";
import { Sun } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

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
          <Link
            className="text-[30px] h-11 w-11 rounded-base flex bg-main text-text border-2 border-black m500:w-9 m500:h-9 m500:text-[22px] items-center justify-center font-heading"
            href={"/app"}
          >
            F
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
          </nav>
        </div>
        <div className="flex items-center gap-4 sm:gap-2">
          <Badge
            variant="default"
            className="text-sm flex items-center gap-1 cursor-pointer hover:opacity-90"
            onClick={() => setShowCreditsDialog(true)}
          >
            <span className="font-heading">{credits}</span>
            <span className="text-xs hidden md:block">Credits</span>
            <span className="text-xs block md:hidden">c</span>
          </Badge>

          <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Need more credits?</DialogTitle>
                <DialogDescription>
                  To get more credits, please contact MrLolDev on Twitter at{" "}
                  <a
                    href="https://twitter.com/mrloldev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @mrloldev
                  </a>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
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
