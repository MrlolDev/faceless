import { Background } from "@/types/packs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Paintbrush } from "lucide-react";

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
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-base">Background:</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="neutral"
            className="w-full flex justify-between"
            disabled={disabled}
          >
            <span className="flex items-center gap-2">
              <Paintbrush className="w-4 h-4" />
              {value.type === "solid"
                ? `Solid ${value.colors[0]}`
                : `${value.colors[0]} to ${value.colors[1]} gradient`}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Solid Colors</DropdownMenuLabel>
          <DropdownMenuSeparator />
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
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Gradients</DropdownMenuLabel>
          <DropdownMenuSeparator />
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
