const API_BASE = "/api/game";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const isJSON = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJSON ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Request failed");
  }

  return data;
}

export function startGame() {
  return request("/start", { method: "POST" });
}

export function spinGame(bet) {
  return request("/spin", {
    method: "POST",
    body: JSON.stringify({ bet })
  });
}
