<script setup>
import { computed, onMounted, ref } from "vue";
import HistorySidebar from "./components/HistorySidebar.vue";
import SummaryPanel from "./components/SummaryPanel.vue";
import TranscriptPanel from "./components/TranscriptPanel.vue";
import UploadComposer from "./components/UploadComposer.vue";
import { useTheme } from "./composables/useTheme.js";
import { api } from "./lib/api.js";
import { getGuestLabel, getOrCreateGuestUserId } from "./lib/user.js";

const userId = getOrCreateGuestUserId();

const { theme, toggleTheme } = useTheme();

const historyItems = ref([]);
const activeId = ref("");
const activeItem = ref(null);
const searchQuery = ref("");
const loadingHistory = ref(false);
const loadingItem = ref(false);
const uploading = ref(false);
const regenerating = ref(false);
const notice = ref("");
const errorMessage = ref("");

const guestLabel = computed(() => getGuestLabel(userId));

const activeTitle = computed(() => {
  return activeItem.value?.summary?.headline || activeItem.value?.fileName || "Транскрибация";
});

async function loadHistory({ preserveSelection = true } = {}) {
  loadingHistory.value = true;

  try {
    const items = await api.listTranscriptions(userId);
    historyItems.value = items;

    if (!preserveSelection) {
      activeId.value = "";
      activeItem.value = null;
    }

    if (!activeId.value && items[0]) {
      await selectItem(items[0].id);
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loadingHistory.value = false;
  }
}

async function selectItem(id) {
  if (!id) {
    return;
  }

  loadingItem.value = true;
  errorMessage.value = "";

  try {
    const item = await api.getTranscription(userId, id);
    activeId.value = item.id;
    activeItem.value = item;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loadingItem.value = false;
  }
}

async function handleUpload(payload) {
  uploading.value = true;
  notice.value = "";
  errorMessage.value = "";

  try {
    const item = await api.createTranscription({
      userId,
      file: payload.file,
      durationSeconds: payload.durationSeconds,
      language: payload.language
    });

    notice.value = "Файл обработан. Транскрибация и выжимка готовы.";
    await loadHistory({ preserveSelection: false });
    activeId.value = item.id;
    activeItem.value = item;
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    uploading.value = false;
  }
}

async function regenerateSummary() {
  if (!activeId.value) {
    return;
  }

  regenerating.value = true;
  notice.value = "";
  errorMessage.value = "";

  try {
    const item = await api.regenerateSummary(userId, activeId.value);
    activeItem.value = item;
    await loadHistory();
    notice.value = "Выжимка обновлена.";
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    regenerating.value = false;
  }
}

onMounted(async () => {
  await loadHistory();
});
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand-block">
        <span class="brand-mark">T</span>
        <div>
          <p class="eyebrow">Transcriptor</p>
          <h1>{{ activeTitle }}</h1>
        </div>
      </div>

      <div class="topbar-actions">
        <span class="ghost-chip">{{ guestLabel }}</span>
        <span class="ghost-chip">Google OAuth позже</span>
        <button class="theme-button" type="button" @click="toggleTheme">
          {{ theme === "dark" ? "Светлая тема" : "Темная тема" }}
        </button>
      </div>
    </header>

    <div v-if="notice" class="flash flash-success">{{ notice }}</div>
    <div v-if="errorMessage" class="flash flash-error">{{ errorMessage }}</div>

    <main class="layout">
      <HistorySidebar
        v-model:query="searchQuery"
        :items="historyItems"
        :active-id="activeId"
        :loading="loadingHistory"
        @select="selectItem"
      />

      <section class="main-column">
        <TranscriptPanel :item="activeItem" :loading="loadingItem || uploading" />
        <UploadComposer :disabled="uploading" @upload="handleUpload" />
      </section>

      <SummaryPanel
        :item="activeItem"
        :loading="loadingItem || uploading"
        :regenerating="regenerating"
        @regenerate="regenerateSummary"
      />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  gap: 1.2rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.15rem 1.35rem;
  border: 1px solid var(--border);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 0.95rem;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 18px;
  background: var(--accent);
  color: #06201d;
  font-size: 1.35rem;
  font-weight: 800;
}

.eyebrow {
  margin: 0 0 0.3rem;
  font: 600 0.73rem/1 "IBM Plex Mono", monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}

.brand-block h1 {
  margin: 0;
  font-size: clamp(1.3rem, 2vw, 2rem);
  line-height: 1;
}

.topbar-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: 0.7rem;
}

.ghost-chip,
.theme-button {
  padding: 0.72rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--panel-elevated);
  color: var(--text-main);
  font: 600 0.8rem/1 "IBM Plex Mono", monospace;
}

.theme-button {
  cursor: pointer;
}

.flash {
  padding: 0.9rem 1rem;
  border-radius: 18px;
  border: 1px solid transparent;
}

.flash-success {
  background: var(--success-soft);
  color: var(--success);
}

.flash-error {
  background: var(--danger-soft);
  color: var(--danger);
}

.layout {
  display: grid;
  grid-template-columns: minmax(260px, 300px) minmax(0, 1fr) minmax(320px, 380px);
  gap: 1rem;
  min-height: calc(100vh - 200px);
}

.main-column {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 1rem;
  min-height: 0;
}

@media (max-width: 1180px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
