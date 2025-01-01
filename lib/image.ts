import { Background, PostureType } from "@/types/packs";
import Replicate from "replicate";
import { serviceRole } from "@/lib/supabase/service-role";

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
  posture: PostureType = "watching-horizon",
  background: Background = {
    type: "solid",
    colors: ["yellow"],
  },
  baseModel: "schnell" | "dev" = "schnell",
  steps: number = 4,
  promptStrength: number = 0.8
) => {
  const posturePrompt =
    posture === "watching-horizon"
      ? "The figure gazes upward to the right toward the horizon."
      : posture === "looking-forward"
      ? "The figure gazes forward."
      : posture === "looking-left"
      ? "The figure gazes left."
      : "The figure gazes right.";

  const backgroundPrompt =
    background.type === "solid"
      ? `The background is a solid color, ${background.colors[0]}.`
      : background.type === "gradient"
      ? `The background is a gradient, ${background.colors.join(", ")}.`
      : background.type === "real-scene"
      ? `The background is a real scene, ${background.scene}.`
      : "";

  const prompt = `A minimalist illustration of ${characterDescription}. ${posturePrompt}. The design excludes eyes, eye lines, nose, and mouth lines for a flat, clean aesthetic. A normal neck is included. ${backgroundPrompt} Styled in the artistic manner of TOK.`;

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
      width: 1024,
      height: 1024,
      output_format: "webp",
      guidance_scale: 3,
      output_quality: 80,
      prompt_strength: promptStrength,
      extra_lora_scale: 1,
      num_inference_steps: steps,
    },
  });

  const output = await replicate.wait(prediction);
  const replicateUrl = output.output[0];

  // Download the image from Replicate
  const response = await fetch(replicateUrl);
  const imageBlob = await response.blob();

  // Create a new Blob with explicit MIME type
  const webpBlob = new Blob([imageBlob], { type: "image/webp" });

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await serviceRole.storage
    .from("packs")
    .upload(`${Date.now()}.webp`, webpBlob, {
      contentType: "image/webp",
      cacheControl: "3600",
    });

  if (uploadError) {
    console.error("Failed to upload generated image to storage", uploadError);
    throw new Error("Failed to upload generated image to storage");
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = serviceRole.storage.from("packs").getPublicUrl(uploadData.path);

  return {
    imgUrl: publicUrl,
    prompt: prompt,
    steps: steps,
    baseModel: baseModel,
    promptStrength: promptStrength,
    facelessVersion: process.env.REPLICATE_MODEL_ID.split(":")[0].split("/")[1],
    cost: (output.metrics?.predict_time || 0) * 0.001525,
  };
};
