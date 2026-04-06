<script setup>
import { ref } from "vue";
import { getAudioDuration } from "../lib/audio.js";

const emit = defineEmits(["upload"]);

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

const fileInputRef = ref(null);
const isDragging = ref(false);
const localError = ref("");
const selectedLanguage = ref("auto");

const supportedExtensions = [".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm", ".ogg"];
const supportedMimePrefixes = ["audio/", "video/mp4"];

async function sendFile(file) {
  localError.value = "";

  if (!file) {
    return;
  }

  const extension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
  const mimeType = file.type || "";

  if (
    !supportedExtensions.includes(extension) &&
    !supportedMimePrefixes.some((prefix) => mimeType.startsWith(prefix))
  ) {
    localError.value = "Формат файла не поддерживается.";
    return;
  }

  const durationSeconds = await getAudioDuration(file);

  emit("upload", {
    file,
    durationSeconds,
    language: selectedLanguage.value
  });
}

function openFileDialog() {
  fileInputRef.value?.click();
}

function handleInput(event) {
  const [file] = event.target.files || [];
  void sendFile(file);
  event.target.value = "";
}

function handleDrop(event) {
  isDragging.value = false;
  const [file] = event.dataTransfer?.files || [];
  void sendFile(file);
}
</script>

<template>
  <section class="upload-card" :class="{ 'is-dragging': isDragging }">
    <div
      class="dropzone"
      @dragenter.prevent="isDragging = true"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInputRef"
        class="hidden-input"
        type="file"
        accept=".mp3,.mp4,.mpeg,.mpga,.m4a,.wav,.webm,.ogg,audio/*,video/mp4"
        :disabled="disabled"
        @change="handleInput"
      />

      <div class="dropzone-copy">
        <strong>Перетащите аудио сюда</strong>
        <span>или выберите файл вручную</span>
      </div>

      <div class="upload-actions">
        <label class="language-field">
          <span>Язык подсказки</span>
          <select v-model="selectedLanguage" :disabled="disabled">
            <option value="auto">Авто</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>

        <button class="primary-button" type="button" :disabled="disabled" @click="openFileDialog">
          {{ disabled ? "Обрабатываем..." : "Выбрать файл" }}
        </button>
      </div>
    </div>

    <p v-if="localError" class="error-text">{{ localError }}</p>
  </section>
</template>

<style scoped>
.upload-card {
  position: relative;
  display: grid;
  gap: 0.85rem;
  padding: 1rem;
  border: 1px solid var(--border-strong);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, var(--accent-soft), transparent 46%),
    linear-gradient(180deg, var(--panel-strong), var(--panel));
  box-shadow: var(--shadow-card);
}

.upload-card.is-dragging {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.dropzone {
  display: grid;
  gap: 1rem;
  padding: 1.1rem;
  border-radius: 24px;
  border: 1px dashed var(--border-strong);
  background: var(--panel-elevated);
}

.dropzone-copy {
  display: grid;
  gap: 0.35rem;
}

.dropzone-copy strong {
  font-size: 1rem;
}

.dropzone-copy span {
  color: var(--text-muted);
}

.upload-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  align-items: end;
  justify-content: space-between;
}

.language-field {
  display: grid;
  gap: 0.5rem;
}

.language-field span {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.language-field select {
  min-width: 150px;
  padding: 0.8rem 1rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--panel);
  color: var(--text-main);
}

.primary-button {
  padding: 0.9rem 1.15rem;
  border: none;
  border-radius: 16px;
  background: var(--accent);
  color: #06201d;
  font-weight: 700;
  cursor: pointer;
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.hidden-input {
  display: none;
}

.error-text {
  margin: 0;
  color: var(--danger);
}
</style>
