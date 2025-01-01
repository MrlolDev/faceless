import { Photos } from "@/types/packs";
import { Button } from "../ui/button";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { sendGAEvent } from "@next/third-parties/google";

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
      toast({
        title: "Photo rated",
        description:
          rating > 0 ? "Thanks for the like!" : "Thanks for the feedback!",
      });
      updatePhoto(data);
      sendGAEvent("event", "rate_photo", {
        rating,
        photo_id: photo.id,
      });
    } catch (error) {
      console.error("Error rating photo:", error);
      toast({
        title: "Error",
        description: "Failed to rate photo",
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
        title="Love avatar"
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
        title="Like avatar"
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
        title="Dislike avatar"
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
