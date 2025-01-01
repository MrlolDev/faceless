export interface Photos {
  id: number;
  imgUrl: string;
  prompt: string;
  steps: number;
  baseModel: string; // schnell or dev
  facelessVersion: string; // v1.1
  prompt_strength: number; // 0-1
  seed: number;
  created_at: Date;
  userId: string;
  upscaledImgUrl: string;
  rating: number; // -1, 0, 1, 2
  packId: number;
  credits: number; // credits per photo
}

export interface Pack {
  id: number;
  userId: string;
  characterDescription: string;
  originPhoto: string; // url of the uploaded photo
  totalCost: number; // total credits used for the pack,
}

export const Postures = [
  "watching-horizon",
  "looking-forward",
  "looking-left",
  "looking-right",
];

export type PostureType = (typeof Postures)[number];

export type Background = {
  type: "solid" | "gradient";
  colors: string[];
};
