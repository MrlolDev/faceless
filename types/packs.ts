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
  noBackgroundImgUrl: string;
  rating: number; // -1, 0, 1, 2
  packId: number;
  credits: number; // credits per photo
  timeForImage: number; // time in seconds for image generation since clicking the button
}

export interface Pack {
  id: number;
  userId: string;
  characterDescription: string;
  originPhoto: string; // url of the uploaded photo
  created_at: Date;
}

export const Postures = [
  "watching-horizon",
  "looking-forward",
  "looking-left",
  "looking-right",
];

export type PostureType = (typeof Postures)[number];

export type Background = {
  type: "solid" | "gradient" | "real-scene";
  scene?: SceneType;
  colors: string[];
};

export const Scenes = [
  "a beach",
  "a forest",
  "a city",
  "a mountain",
  "a desert",
  "an office",
  "a library",
  "a park",
  "a school",
  "a hospital",
  "a museum",
];

export const SceneEmojis = {
  "a beach": "🏖️",
  "a forest": "🌲",
  "a city": "🏙️",
  "a mountain": "🏔️",
  "a desert": "🏜️",
  "an office": "🏢",
  "a library": "📚",
  "a park": "🏞️",
  "a school": "🏫",
  "a hospital": "🏥",
  "a museum": "🏛️",
};

export type SceneType = (typeof Scenes)[number];
