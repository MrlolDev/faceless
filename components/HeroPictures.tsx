"use client";

import Image from "next/image";

const pictures = {
  ai_one: [
    "https://replicate.delivery/xezq/UvZMoh4kfT1USaiRFGL3j4lT3h97X11u3XwwRfl1ODMgJwAUA/out-0.webp",
    "https://replicate.delivery/xezq/f0wg4dTXWlzUSiyPaylqEBgpSJPTci31SghKkcGWVCm9EYAKA/out-0.webp",
    "https://replicate.delivery/xezq/emLMhYsv1nSHdahMunOVArhlI0WAyL6Dy8NYiftbyyl5KwAUA/out-0.webp",
    "https://replicate.delivery/xezq/lUPxIXWZrDYBAVofx9JFDjKU2bbfD57TeXNIRQHbsA7dWgBoA/out-0.webp",
    "https://replicate.delivery/xezq/IdC6oCe69j2YSKokTgXPvJ91u2kvobwdrYCgB5Ttg22JGYAKA/out-0.webp",
  ],
  ai_two: [
    "https://replicate.delivery/xezq/gNDCGQdhHTYMMhhwBuWDRwCROVg5y7zu5q8vrwGe2g0rFYAKA/out-0.webp",
    "https://replicate.delivery/xezq/SPSpQ1LXwX6CBFw6Neq78d47fCif5dJ7e2l3H21IFuMjuADQB/out-0.webp",
    "https://replicate.delivery/xezq/gbaTKw8ziwIYPJ1NRFwbL0lSKZLUQaRjOYNvkgPZnZk8CMAF/out-0.webp",
    "https://replicate.delivery/xezq/AKQeWN0wb2Q2VyRiXZxQn4M1qy9yAwQ7YbsF64uYdmDEGYAKA/out-0.webp",
  ],
};
export default function HeroPictures() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-2 h-[100dvh] m1000:hidden w-[750px] m1600:w-[650px] m1500:w-[400px] m1500:right-32 m1200:w-[330px] m1100:right-2 m1500:grid-cols-1 right-2 absolute top-0 portrait:h-[100svh] overflow-y-hidden gap-5"
    >
      <div className="max-w-full">
        <div
          className="relative flex flex-col w-full max-w-full h-full overflow-hidden pr-1 gap-5"
          style={{
            animation: "scroll 25s linear infinite",
          }}
        >
          {[...pictures.ai_one, ...pictures.ai_one].map((picture, index) => (
            <Image
              key={index}
              src={picture}
              alt="Real picture"
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      </div>
      <div className="max-w-full m1500:hidden">
        <div
          className="relative flex flex-col w-full max-w-full h-full overflow-hidden pr-1 gap-5"
          style={{
            animation: "scroll 25s linear infinite reverse",
          }}
        >
          {[...pictures.ai_two, ...pictures.ai_two].map((picture, index) => (
            <Image
              key={index}
              src={picture}
              alt="AI picture"
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
