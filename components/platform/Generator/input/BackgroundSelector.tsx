import { Background, SceneEmojis, Scenes } from "@/types/packs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Paintbrush } from "lucide-react";
import { useTranslations } from "next-intl";

interface BackgroundSelectorProps {
  value: Background;
  onChange: (background: Background) => void;
  disabled?: boolean;
}

const SOLID_COLORS = [
  "yellow",
  "orange",
  "red",
  "pink",
  "purple",
  "blue",
  "green",
  "gray",
  "white",
  "black",
];

const GRADIENTS = [
  ["yellow", "orange"],
  ["orange", "red"],
  ["red", "purple"],
  ["purple", "blue"],
  ["blue", "green"],
  ["yellow", "green"],
];

export default function BackgroundSelector({
  value,
  onChange,
  disabled,
}: BackgroundSelectorProps) {
  const t = useTranslations("generator");

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-base">{t("background")}:</label>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="neutral" className="w-32" disabled={disabled}>
              <span className="flex items-center gap-2">
                <Paintbrush className="w-4 h-4" />
                {value.type === "solid"
                  ? t("solid")
                  : value.type === "gradient"
                  ? t("gradient")
                  : t("scene")}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                onChange({
                  type: "solid",
                  colors: [value.type === "solid" ? value.colors[0] : "white"],
                })
              }
            >
              {t("solid")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onChange({
                  type: "gradient",
                  colors:
                    value.type === "gradient"
                      ? value.colors
                      : ["yellow", "orange"],
                })
              }
            >
              {t("gradient")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onChange({
                  type: "real-scene",
                  scene: value.type === "real-scene" ? value.scene : Scenes[0],
                  colors: [],
                })
              }
            >
              {t("scene")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="neutral" className="flex-1" disabled={disabled}>
              {value.type === "solid" && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: value.colors[0] }}
                  />

                  <span className="capitalize">{value.colors[0]}</span>
                </div>
              )}
              {value.type === "gradient" && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{
                      background: `linear-gradient(to right, ${value.colors[0]}, ${value.colors[1]})`,
                    }}
                  />
                  <span className="capitalize">
                    {value.colors[0]} to {value.colors[1]}
                  </span>
                </div>
              )}
              {value.type === "real-scene" && (
                <div className="flex items-center gap-2">
                  {SceneEmojis[value.scene as keyof typeof SceneEmojis]}
                  <span className="capitalize">{value.scene}</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {value.type === "solid" && (
              <>
                {SOLID_COLORS.map((color) => (
                  <DropdownMenuItem
                    key={color}
                    onClick={() => onChange({ type: "solid", colors: [color] })}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                      <span className="capitalize">{color}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            {value.type === "gradient" && (
              <>
                {GRADIENTS.map(([color1, color2]) => (
                  <DropdownMenuItem
                    key={`${color1}-${color2}`}
                    onClick={() =>
                      onChange({ type: "gradient", colors: [color1, color2] })
                    }
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className="w-4 h-4 rounded-full border border-border"
                        style={{
                          background: `linear-gradient(to right, ${color1}, ${color2})`,
                        }}
                      />
                      <span className="capitalize">
                        {color1} to {color2}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            {value.type === "real-scene" && (
              <>
                {Scenes.map((scene) => (
                  <DropdownMenuItem
                    key={scene}
                    onClick={() =>
                      onChange({ type: "real-scene", scene, colors: [] })
                    }
                  >
                    <span className="capitalize">
                      {SceneEmojis[scene as keyof typeof SceneEmojis]} {scene}
                    </span>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
