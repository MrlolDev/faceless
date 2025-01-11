"use client";
import Navbar from "@/components/Landing/LandingNavbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import HeroPictures from "@/components/Landing/HeroPictures";
import { useTheme } from "next-themes";
const productHunt = true;

export default function Home() {
  const t = useTranslations("home");
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Navbar />
      <main className="relative flex min-h-[100svh] w-full items-center justify-start bg-bg dark:bg-darkBg px-4 sm:px-8 md:px-16 lg:px-32 y-[100px] sm:py-[200px] font-bold">
        <div className=" w-full max-w-7xl sm:max-w-lg xl:max-w-xl text-center lg:text-left justify-center items-start h-full flex flex-col">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading">
            {t("title")}
          </h1>

          <p className="mt-4 sm:mt-6 mb-6 sm:mb-8 leading-snug text-lg sm:text-xl md:text-2xl lg:text-3xl font-base">
            {t("description")}
          </p>
          <div className="flex flex-row items-center gap-2">
            <Link href="/app" className="inline-block">
              <Button size="lg" className="w-full sm:w-auto">
                {t("getStarted")}
              </Button>
            </Link>
            {productHunt && (
              <a
                href="https://www.producthunt.com/posts/faceless-avatar?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-faceless&#0045;avatar"
                target="_blank"
              >
                <div suppressHydrationWarning>
                  <img
                    suppressHydrationWarning
                    src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=749370&theme=${theme}`}
                    alt="Faceless Avatar - Create stunning faceless avatar illustrations in seconds! | Product Hunt"
                    style={{ width: "250px", height: "54px" }}
                    width="250"
                    height="54"
                  />
                </div>
              </a>
            )}
          </div>
        </div>
      </main>
      <HeroPictures />
    </div>
  );
}
