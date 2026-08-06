// Dedicated raw-fetch streaming client for the public AI chat endpoint.
// Bypasses `apiClient` (base.ts) since it can't handle a streaming response body,
// and this endpoint is public (no Authorization header needed).

import { API_BASE_URL } from "./base";

export async function streamChatMessage(
  sessionId: string,
  message: string,
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/ai-chat/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error("Không thể kết nối tới trợ lý AI.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    buffer = buffer.replace(/\r\n/g, "\n");

    let sepIndex: number;
    while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, sepIndex);
      buffer = buffer.slice(sepIndex + 2);

      for (const line of rawEvent.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;

        let parsed: { token?: string; error?: string };
        try {
          parsed = JSON.parse(data) as { token?: string; error?: string };
        } catch {
          continue;
        }
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.token) onToken(parsed.token);
      }
    }
  }
}
