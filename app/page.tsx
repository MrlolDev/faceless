import HeroPictures from "@/components/Landing/HeroPictures";
import Navbar from "@/components/Landing/LandingNavbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Navbar />
      <main className="relative flex min-h-[100svh] flex-col items-center justify-center bg-bg dark:bg-darkBg px-4 sm:px-8 md:px-16 lg:px-32 xl:px-80 py-[100px] sm:py-[200px] font-bold">
        <div className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading">
              Faceless Avatar
            </h1>

            <p className="mt-4 sm:mt-6 mb-6 sm:mb-8 leading-snug text-lg sm:text-xl md:text-2xl lg:text-3xl font-base">
              Faceless is a platform for creating AI avatars. Just upload a
              picture and we&apos;ll generate an AI avatar for you.
            </p>

            <Link href="/app" className="inline-block">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
        <HeroPictures />
      </main>
    </div>
  );
}
