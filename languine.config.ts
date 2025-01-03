import { defineConfig } from "languine";

export default defineConfig({
  version: "1.0.2",
  locale: {
    source: "en",
    targets: ["es", "fr", "de", "pt", "it", "nl", "ru"],
  },
  files: {
    json: {
      include: ["messages/[locale].json"],
    },
  },
  llm: {
    provider: "openai",
    model: "gpt-4-turbo",
  },
});
