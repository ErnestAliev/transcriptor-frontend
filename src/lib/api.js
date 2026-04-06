const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api").replace(
  /\/$/,
  ""
);

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Не удалось выполнить запрос.");
  }

  return payload;
}

function userHeaders(userId, extraHeaders = {}) {
  return {
    "x-user-id": userId,
    ...extraHeaders
  };
}

export const api = {
  async listTranscriptions(userId) {
    const payload = await request("/transcriptions", {
      headers: userHeaders(userId)
    });

    return payload.items || [];
  },

  async getTranscription(userId, id) {
    const payload = await request(`/transcriptions/${id}`, {
      headers: userHeaders(userId)
    });

    return payload.item;
  },

  async createTranscription({ userId, file, language = "auto", durationSeconds = null }) {
    const formData = new FormData();

    formData.append("audio", file);
    formData.append("language", language);

    if (durationSeconds !== null && Number.isFinite(durationSeconds)) {
      formData.append("durationSeconds", durationSeconds.toFixed(1));
    }

    const payload = await request("/transcriptions", {
      method: "POST",
      headers: userHeaders(userId),
      body: formData
    });

    return payload.item;
  },

  async regenerateSummary(userId, id) {
    const payload = await request(`/transcriptions/${id}/summarize`, {
      method: "POST",
      headers: userHeaders(userId)
    });

    return payload.item;
  }
};
