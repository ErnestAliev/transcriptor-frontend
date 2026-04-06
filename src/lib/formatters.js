export function formatDateTime(value) {
  if (!value) {
    return "Нет даты";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) {
    return "Неизвестно";
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "Неизвестно";
  }

  const totalSeconds = Math.round(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainder = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}ч ${String(minutes).padStart(2, "0")}м`;
  }

  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

export function formatStatus(status) {
  const labels = {
    processing: "В обработке",
    completed: "Готово",
    failed: "Ошибка"
  };

  return labels[status] || status;
}
