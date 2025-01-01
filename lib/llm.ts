import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getGroqChatCompletion = async (
  messages: ChatCompletionMessageParam[]
) => {
  const chatCompletion = await client.chat.completions.create({
    messages: messages,
    model: "llama-3.2-90b-vision-preview",
    temperature: 0.2,
    max_tokens: 2048,
  });

  return chatCompletion.choices[0].message.content;
};
const getOpenAIChatCompletion = async (
  messages: ChatCompletionMessageParam[]
) => {
  const chatCompletion = await client.chat.completions.create({
    messages: messages,
    model: "gpt-4o",
  });
  return {
    description: chatCompletion.choices[0].message.content,
    tokens: chatCompletion.usage?.total_tokens || 0,
  };
};

export const getCharacterDescription = async (imageURL: string) => {
  const { description, tokens } = await getOpenAIChatCompletion([
    {
      role: "system",
      content:
        "Answer with a short description of the character. Do not describe the setting or background. Just describe the character as good as you can. Do not add any introduction, just answer with the description. Description should be 1-2 sentences. For example: 'A young woman with long black hair and blue eyes. She is wearing a red dress and has a necklace with a heart pendant.'",
    },
    {
      role: "user",
      content: [
        { type: "image_url", image_url: { url: imageURL } },
        { type: "text", text: "Describe the character" },
      ],
    },
  ]);
  /**
   * 
   * $2.50 / 1M input tokens
$1.25 / 1M cached** input tokens
$10.00 / 1M output tokens
   */
  const pricePerToken = 10 / 1000000;
  const cost = (tokens || 0) * pricePerToken + 0.000638;
  return {
    description: description,
    tokens: tokens,
    cost: cost,
  };
};
