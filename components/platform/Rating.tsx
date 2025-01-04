import { Photos } from "@/types/packs";
import { Button } from "../ui/button";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { sendGAEvent } from "@next/third-parties/google";
import { useTranslations } from "next-intl";

export default function Rating({
  photo,
  className,
  updatePhoto,
}: {
  photo: Photos | null;
  updatePhoto: (photo: Photos) => void;
  className?: string;
}) {
  const { toast } = useToast();
  const t = useTranslations("rating");
  const handleRate = async (rating: number) => {
    if (!photo) return;

    try {
      const response = await fetch(`/api/photos/${photo.id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to rate photo");
      }
      const data = await response.json();

      // Show rating toast
      toast({
        title: t("photoRated"),
        description:
          rating > 0 ? t("thanksForTheLike") : t("thanksForTheFeedback"),
      });

      // If bonus credits were awarded, show additional toast
      if (data.bonusCredits) {
        toast({
          title: t("success"),
          description: t("youveReceivedCredits", {
            credits: data.bonusCredits,
          }),
        });
      }

      updatePhoto(data);
      sendGAEvent("event", "rate_photo", {
        rating,
        photo_id: photo.id,
      });
    } catch (error) {
      console.error("Error rating photo:", error);
      toast({
        title: t("error"),
        description: t("failedToRatePhoto"),
        variant: "destructive",
      });
    }
  };
  return (
    <div className={cn("flex gap-4", className)}>
      <Button
        variant="neutral"
        size="icon"
        onClick={() => handleRate(2)}
        className={cn(
          photo?.rating === 2 && "text-yellow-500",
          "hover:text-yellow-500"
        )}
        aria-label="Love avatar"
        title={t("loveAvatar")}
      >
        <Star className="h-4 w-4" />
      </Button>

      <Button
        variant="neutral"
        size="icon"
        onClick={() => handleRate(1)}
        className={cn(
          photo?.rating === 1 && "text-green-500",
          "hover:text-green-500"
        )}
        aria-label="Like avatar"
        title={t("likeAvatar")}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>

      <Button
        variant="neutral"
        size="icon"
        onClick={() => handleRate(-1)}
        className={cn(
          photo?.rating === -1 && "text-red-500",
          "hover:text-red-500"
        )}
        aria-label="Dislike avatar"
        title={t("dislikeAvatar")}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
