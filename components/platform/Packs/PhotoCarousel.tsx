import { Pack, Photos } from "@/types/packs";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Rating from "../Rating";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/hooks/use-toast";
import { sendGAEvent } from "@next/third-parties/google";
import { downloadImageAsPng } from "@/lib/img-utils";

interface PhotoCarouselProps {
  photos: Photos[];
  pack: Pack & { photos: Photos[] };
  updatePhoto: (photo: Photos) => void;
}

export default function PhotoCarousel({
  photos,
  pack,
  updatePhoto,
}: PhotoCarouselProps) {
  if (photos.length === 0) return null;
  const { toast } = useToast();

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Image URL copied",
      description: "Your image URL has been copied",
    });
  };
  const downloadImage = async (imgUrl: string) => {
    try {
      sendGAEvent("event", "download_avatar", {
        avatarUrl: imgUrl,
      });
      const blob = await downloadImageAsPng(imgUrl);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "avatar.png";
      a.click();
      toast({
        title: "Image downloaded",
        description: "Your avatar has been downloaded",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  const shareOnTwitter = (imgUrl: string) => {
    sendGAEvent("event", "share_avatar", {
      avatarUrl: imgUrl,
    });
    const tweetText =
      "Check out my new AI-generated avatar! 🤖✨\n\n\nPlatform made by @mrloldev";
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(
      "https://faceless-avatar.com/pic/" +
        imgUrl.split("packs/")[1].split(".webp")[0]
    )}`;
    window.open(tweetUrl, "_blank");
  };

  return (
    <Carousel className="w-full  h-fit">
      <CarouselContent className="h-full w-full">
        <CarouselItem key={pack.id} className="h-full w-full">
          <div className="pt-0 px-[40px] h-[400px] w-full aspect-square flex flex-col items-center justify-start">
            <img
              src={pack.originPhoto}
              alt="Generated avatar"
              className="object-cover rounded-base border-2 border-border w-[300px] h-[300px] aspect-square"
            />
            <p className="text-sm font-base">Original photo</p>
          </div>
        </CarouselItem>
        {photos.map((photo) => (
          <CarouselItem key={photo.id} className="h-full w-full">
            <div className="pt-0 px-[40px] h-full w-full flex flex-col gap-4 items-center">
              <ContextMenu>
                <ContextMenuTrigger>
                  <Image
                    src={photo.imgUrl}
                    alt="Generated avatar"
                    className="object-cover rounded-base border-2 border-border w-[300px] h-[300px] aspect-square"
                    width={200}
                    height={200}
                  />
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={() => copyImageUrl(photo.imgUrl)}
                    className="w-full cursor-pointer"
                  >
                    Copy Image URL
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => downloadImage(photo.imgUrl)}
                    className="w-full cursor-pointer"
                  >
                    Download as PNG
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => shareOnTwitter(photo.imgUrl)}
                    className="w-full cursor-pointer"
                  >
                    Share on Twitter
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
              <Rating photo={photo} className="" updatePhoto={updatePhoto} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
}
