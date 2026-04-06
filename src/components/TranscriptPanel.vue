<script setup>
import { computed } from "vue";
import { formatDateTime, formatDuration, formatFileSize, formatStatus } from "../lib/formatters.js";

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const meta = computed(() => {
  if (!props.item) {
    return [];
  }

  return [
    { label: "Статус", value: formatStatus(props.item.status) },
    { label: "Дата", value: formatDateTime(props.item.createdAt) },
    { label: "Длительность", value: formatDuration(props.item.durationSeconds) },
    { label: "Размер", value: formatFileSize(props.item.fileSize) },
    { label: "Язык", value: props.item.detectedLanguage || props.item.requestedLanguage || "auto" }
  ];
});
</script>

<template>
  <section class="panel transcript-panel">
    <div v-if="loading" class="panel-state">Загружаем транскрибацию...</div>
    <div v-else-if="!item" class="panel-state">
      Выберите запись слева или загрузите новый файл.
    </div>
    <template v-else>
      <header class="panel-header">
        <div>
          <p class="eyebrow">Текст</p>
          <h2>{{ item.fileName }}</h2>
        </div>
        <div class="meta-grid">
          <div v-for="entry in meta" :key="entry.label" class="meta-card">
            <span>{{ entry.label }}</span>
            <strong>{{ entry.value }}</strong>
          </div>
        </div>
      </header>

      <div v-if="item.errorMessage" class="error-block">
        {{ item.errorMessage }}
      </div>

      <article class="transcript-copy">
        {{ item.transcriptText || "Текст транскрибации появится здесь после обработки." }}
      </article>
    </template>
  </section>
</template>

<style scoped>
.panel {
  display: grid;
  gap: 1.35rem;
  min-height: 0;
  padding: 1.4rem;
  border: 1px solid var(--border);
  border-radius: 28px;
  background: var(--panel);
  box-shadow: var(--shadow-card);
}

.panel-state {
  display: grid;
  place-items: center;
  min-height: 280px;
  color: var(--text-muted);
  border: 1px dashed var(--border);
  border-radius: 20px;
}

.panel-header {
  display: grid;
  gap: 1rem;
}

.eyebrow {
  margin: 0 0 0.35rem;
  font: 600 0.73rem/1 "IBM Plex Mono", monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}

.panel-header h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2vw, 2rem);
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  gap: 0.8rem;
}

.meta-card {
  display: grid;
  gap: 0.3rem;
  padding: 0.8rem 0.9rem;
  border-radius: 16px;
  background: var(--panel-elevated);
}

.meta-card span {
  color: var(--text-muted);
  font-size: 0.76rem;
}

.meta-card strong {
  font-size: 0.9rem;
}

.error-block {
  padding: 0.95rem 1rem;
  border-radius: 18px;
  background: var(--danger-soft);
  color: var(--danger);
}

.transcript-copy {
  white-space: pre-wrap;
  line-height: 1.72;
  font-size: 0.98rem;
}
</style>
