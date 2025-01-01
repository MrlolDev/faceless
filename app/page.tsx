import HeroPictures from "@/components/HeroPictures";
import Navbar from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Navbar />
      <main className="relative flex min-h-[100svh] flex-col items-center justify-center bg-bg dark:bg-darkBg px-80 py-[200px] font-bold">
        <div className="mx-auto w-container max-w-full grid grid-cols-2 m1100:grid-cols-1">
          <div className="text-left m1000:text-center m1100:w-4/5 m1000:w-full">
            <h1 className="text-5xl font-heading m1400:text-4xl m800:text-3xl m500:text-2xl m400:text-xl">
              Faceless
            </h1>

            <p className="mb-[30px] leading-snug m800:mb-10 m800:mt-8 m1100:w-3/4 m1000:w-full mt-[20px] m1400:text-2xl font-base text-3xl m800:text-lg m400:text-base">
              Faceless is a platform for creating AI avatars. Just upload a
              picture and we&apos;ll generate an AI avatar for you.
            </p>

            <Link className="w-fit " href={"/app"}>
              <Button className="w-fit" size="lg">
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
