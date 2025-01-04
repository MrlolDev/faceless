"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/Theme/ThemeSwitcher";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";

const LANGUAGES = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  nl: "Nederlands",
  ru: "Русский",
};

export default function Navbar() {
  const t = useTranslations("home");
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    Cookies.set("NEXT_LOCALE", newLocale, { path: "/" });
    router.push(`/${newLocale}`);
  };

  return (
    <nav className="fixed left-0 top-0 z-20 w-full h-16 sm:h-[88px] border-b-4 border-border dark:border-darkNavBorder bg-white dark:bg-secondaryBlack justify-center flex items-center ">
      <div className="mx-0 px-4 sm:px-5 max-w-[1300px] h-full flex items-center justify-between w-full">
        <div className="flex items-center gap-4 sm:gap-10">
          <Link href="/">
            <Image
              src="/icon.svg"
              alt="Faceless Avatar Logo"
              className="rounded-lg h-12 w-12"
              width={50}
              height={50}
            />
          </Link>

          <div className="hidden sm:flex items-center gap-8">
            <Link className="text-base sm:text-xl font-base" href="/app">
              {t("platform")}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              target="_blank"
              href="https://twitter.com/mrloldev"
              className="hidden sm:flex items-center justify-center rounded-base border-2 border-border shadow-nav dark:shadow-navDark dark:border-darkBorder p-2 transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none dark:hover:shadow-none"
            >
              <svg
                className="h-4 w-4 sm:h-6 sm:w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  className="fill-text dark:fill-darkText"
                  d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                />
              </svg>
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center rounded-base border-2 border-border shadow-nav dark:shadow-navDark dark:border-darkBorder p-2 transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none dark:hover:shadow-none">
                <Globe className="h-4 w-4 sm:h-6 sm:w-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
