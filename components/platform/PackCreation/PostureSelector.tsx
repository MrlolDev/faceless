import { PostureType, Postures } from "@/types/packs";
import { Button } from "@/components/ui/button";

interface PostureSelectorProps {
  value: PostureType;
  onChange: (posture: PostureType) => void;
  disabled?: boolean;
}

export default function PostureSelector({
  value,
  onChange,
  disabled,
}: PostureSelectorProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-base">Select Pose:</label>
      <div className="grid grid-cols-2 gap-2">
        {Postures.map((posture) => (
          <Button
            key={posture}
            variant={value === posture ? "default" : "neutral"}
            className="w-full capitalize"
            onClick={() => onChange(posture)}
            disabled={disabled}
          >
            {posture.replace(/-/g, " ")}
          </Button>
        ))}
      </div>
    </div>
  );
}
