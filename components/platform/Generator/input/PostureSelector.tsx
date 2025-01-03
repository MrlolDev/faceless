import { PostureType, Postures } from "@/types/packs";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("generator");

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-base">{t("selectPose")}:</label>
      <div className="grid grid-cols-2 gap-2">
        {Postures.map((posture) => (
          <Button
            key={posture}
            variant={value === posture ? "default" : "neutral"}
            className="w-full capitalize"
            onClick={() => onChange(posture)}
            disabled={disabled}
          >
            {t(posture)}
          </Button>
        ))}
      </div>
    </div>
  );
}
