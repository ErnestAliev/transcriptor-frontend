const STORAGE_KEY = "transcriptor.user-id";

function createFallbackId() {
  return `guest-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateGuestUserId() {
  const existing = localStorage.getItem(STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const nextId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : createFallbackId();

  localStorage.setItem(STORAGE_KEY, nextId);
  return nextId;
}

export function getGuestLabel(userId) {
  return `guest:${String(userId).slice(0, 8)}`;
}
