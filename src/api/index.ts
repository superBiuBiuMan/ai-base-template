import { SSE } from "sse.js";
import { getEnv } from "@/utils/base";
import { ulid } from "ulid";
export function createAiStream({ content, chatId, ...otherInfo }) {
  return new SSE(`${getEnv("VITE_API_BASE_URL")}/api/v1/chat/completions`, {
    method: "POST",
    start: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer fastgpt-k8P6xrzF8Snd2zEq48if859Z4LqhAVXnFgnyWzprtqZFfm9SIW6l59aur`,
    },
    payload: JSON.stringify({
      chatId,
      stream: true,
      detail: true,
      messages: [
        {
          content: content,
          role: "user",
        },
      ],
      ...otherInfo,
    }),
  });
}
