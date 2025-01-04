import Navbar from "@/components/Landing/LandingNavbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import HeroPictures from "@/components/Landing/HeroPictures";
export default function Home() {
  const t = useTranslations("home");

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

          <Link href="/app" className="inline-block">
            <Button size="lg" className="w-full sm:w-auto">
              {t("getStarted")}
            </Button>
          </Link>
        </div>
      </main>
      <HeroPictures />
    </div>
  );
}
