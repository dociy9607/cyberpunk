import { kvToken, kvUrl } from "./env";

export async function kvRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${kvUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${kvToken()}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
