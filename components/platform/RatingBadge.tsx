import { Star, ThumbsDown, ThumbsUp, HeartCrack } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface RatingBadgeProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
}

export default function RatingBadge({
  rating,
  onRatingChange,
}: RatingBadgeProps) {
  const getRatingIcon = (value: number) => {
    switch (value) {
      case 2:
        return <Star className="w-3 h-3" />;
      case 1:
        return <ThumbsUp className="w-3 h-3" />;
      case -1:
        return <ThumbsDown className="w-3 h-3" />;
      case 0:
      default:
        return <HeartCrack className="w-3 h-3" />;
    }
  };

  const ratingOptions = [
    { value: 2, label: "Love it" },
    { value: 1, label: "Like it" },
    { value: 0, label: "Neutral" },
    { value: -1, label: "Dislike" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="neutral"
          className="absolute top-2 right-2 z-10 cursor-pointer"
        >
          {getRatingIcon(rating)}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ratingOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onRatingChange?.(option.value)}
          >
            {getRatingIcon(option.value)}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
