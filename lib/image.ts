import Replicate from "replicate";

declare const process: {
  env: {
    REPLICATE_MODEL_ID: `${string}/${string}` | `${string}/${string}:${string}`;
    REPLICATE_MODEL_VERSION: string;
    REPLICATE_API_TOKEN: string;
  };
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const getImage = async (
  imageURL: string,
  characterDescription: string,
  baseModel: "schnell" | "dev" = "schnell",
  steps: number = 4,
  promptStrength: number = 0.8
) => {
  const prompt = `A minimalist illustration of ${characterDescription}. The figure gazes upward to the right toward the horizon. The design excludes eyes, eye lines, nose, and mouth lines for a flat, clean aesthetic. A normal neck is included. The background is a solid color, yellow. Styled in the artistic manner of TOK.`;
  const prediction = await replicate.predictions.create({
    version: process.env.REPLICATE_MODEL_VERSION,
    input: {
      image: imageURL,
      model: baseModel,
      prompt: prompt,
      go_fast: false,
      lora_scale: 1,
      megapixels: "1",
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      guidance_scale: 3,
      output_quality: 80,
      prompt_strength: promptStrength,
      extra_lora_scale: 1,
      num_inference_steps: steps,
    },
  });
  const output = await replicate.wait(prediction);
  return {
    imgUrl: output.output[0],
    prompt: prompt,
    steps: steps,
    baseModel: baseModel,
    promptStrength: promptStrength,
    facelessVersion: process.env.REPLICATE_MODEL_ID.split(":")[0].split("/")[1],
    cost: (output.metrics?.predict_time || 0) * 0.001525,
  };
};
