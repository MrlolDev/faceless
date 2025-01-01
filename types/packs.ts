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
  packId: string;
  credits: number; // credits per photo
}

export interface Pack {
  id: string;
  userId: string;
  characterDescription: string;
  originPhoto: string; // url of the uploaded photo
}
