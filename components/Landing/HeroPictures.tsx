"use client";

const pictures = {
  ai_one: [
    "https://kbthrjuoewftreopxkiq.supabase.co/storage/v1/object/public/packs/1735986426283.webp",
    "https://kbthrjuoewftreopxkiq.supabase.co/storage/v1/object/public/packs/1735986595857.webp",
    "https://kbthrjuoewftreopxkiq.supabase.co/storage/v1/object/public/packs/1735986672727.webp",
    "https://kbthrjuoewftreopxkiq.supabase.co/storage/v1/object/public/packs/14661532-5c5a-4a1b-8b85-db7b7b7eb4f7/generated/1735987566887.webp",
  ],
  ai_two: [
    "https://kbthrjuoewftreopxkiq.supabase.co/storage/v1/object/public/packs/14661532-5c5a-4a1b-8b85-db7b7b7eb4f7/generated/1735987187198.webp",
    "https://kbthrjuoewftreopxkiq.supabase.co/storage/v1/object/public/packs/14661532-5c5a-4a1b-8b85-db7b7b7eb4f7/generated/1735987303275.webp",
    "https://kbthrjuoewftreopxkiq.supabase.co/storage/v1/object/public/packs/14661532-5c5a-4a1b-8b85-db7b7b7eb4f7/generated/1735987505304.webp",
    "https://kbthrjuoewftreopxkiq.supabase.co/storage/v1/object/public/packs/14661532-5c5a-4a1b-8b85-db7b7b7eb4f7/generated/1735987642180.webp",
  ],
};
export default function HeroPictures() {
  return (
    <div
      aria-hidden="true"
      className=" grid-cols-2 h-[100dvh] hidden w-0 sm:grid sm:w-[750px]   m1500:w-[400px] m1500:right-32 m1200:w-[330px] m1100:right-2 m1500:grid-cols-1 right-2 absolute top-0 portrait:h-[100svh] overflow-y-hidden gap-5"
    >
      <div className="max-w-full">
        <div
          className="relative flex flex-col w-full max-w-full h-full overflow-hidden pr-1 gap-5"
          style={{
            animation: "scroll 25s linear infinite",
          }}
        >
          {[...pictures.ai_one, ...pictures.ai_one].map((picture, index) => (
            <img
              key={index}
              src={picture}
              alt="Faceless Avatar"
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
            <img
              key={index}
              src={picture}
              alt="Faceless Avatar"
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
