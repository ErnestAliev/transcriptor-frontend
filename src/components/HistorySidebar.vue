<script setup>
import { computed } from "vue";
import { formatDateTime, formatDuration, formatStatus } from "../lib/formatters.js";

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  activeId: {
    type: String,
    default: ""
  },
  loading: {
    type: Boolean,
    default: false
  },
  query: {
    type: String,
    default: ""
  }
});

defineEmits(["select", "update:query"]);

const filteredItems = computed(() => {
  const normalizedQuery = props.query.trim().toLowerCase();

  if (!normalizedQuery) {
    return props.items;
  }

  return props.items.filter((item) => {
    return [item.fileName, item.headline, item.excerpt].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  });
});
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <div>
        <p class="eyebrow">История</p>
        <h2>Транскрибации</h2>
      </div>

      <span class="counter">{{ filteredItems.length }}</span>
    </div>

    <label class="search-field">
      <span>Поиск</span>
      <input
        :value="query"
        type="search"
        placeholder="Файл, факт, фраза"
        @input="$emit('update:query', $event.target.value)"
      />
    </label>

    <div v-if="loading" class="sidebar-state">Загружаем историю...</div>
    <div v-else-if="filteredItems.length === 0" class="sidebar-state">
      История пока пустая.
    </div>

    <div v-else class="history-list">
      <button
        v-for="item in filteredItems"
        :key="item.id"
        class="history-item"
        :class="{ active: item.id === activeId }"
        type="button"
        @click="$emit('select', item.id)"
      >
        <div class="history-item-top">
          <span class="status" :data-status="item.status">{{ formatStatus(item.status) }}</span>
          <span class="time">{{ formatDateTime(item.createdAt) }}</span>
        </div>

        <strong class="file-name">{{ item.fileName }}</strong>
        <p class="headline">{{ item.headline || item.excerpt || "Без описания" }}</p>

        <div class="history-item-bottom">
          <span>{{ formatDuration(item.durationSeconds) }}</span>
          <span>{{ item.detectedLanguage || item.requestedLanguage || "auto" }}</span>
        </div>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 1rem;
  min-height: 0;
  padding: 1.3rem;
  border: 1px solid var(--border);
  border-radius: 28px;
  background:
    linear-gradient(180deg, var(--sidebar-start), var(--sidebar-end)),
    var(--panel);
}

.sidebar-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.eyebrow {
  margin: 0 0 0.35rem;
  font: 600 0.73rem/1 "IBM Plex Mono", monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}

.sidebar-top h2 {
  margin: 0;
  font-size: 1.2rem;
}

.counter {
  min-width: 2.2rem;
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  background: var(--panel-elevated);
  text-align: center;
  font: 600 0.82rem/1 "IBM Plex Mono", monospace;
}

.search-field {
  display: grid;
  gap: 0.45rem;
}

.search-field span {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.search-field input {
  width: 100%;
  padding: 0.8rem 0.95rem;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--panel-elevated);
  color: var(--text-main);
}

.sidebar-state {
  display: grid;
  place-items: center;
  min-height: 180px;
  color: var(--text-muted);
  border: 1px dashed var(--border);
  border-radius: 20px;
}

.history-list {
  display: grid;
  gap: 0.75rem;
  overflow: auto;
  padding-right: 0.2rem;
}

.history-item {
  display: grid;
  gap: 0.7rem;
  padding: 1rem;
  border: 1px solid transparent;
  border-radius: 20px;
  background: var(--panel-elevated);
  color: var(--text-main);
  text-align: left;
  cursor: pointer;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;
}

.history-item:hover,
.history-item.active {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.history-item-top,
.history-item-bottom {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
  color: var(--text-muted);
  font-size: 0.76rem;
}

.status {
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  background: var(--chip-bg);
  font: 600 0.69rem/1 "IBM Plex Mono", monospace;
}

.status[data-status="completed"] {
  color: var(--success);
}

.status[data-status="failed"] {
  color: var(--danger);
}

.status[data-status="processing"] {
  color: var(--accent);
}

.file-name {
  font-size: 0.94rem;
}

.headline {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.88rem;
  line-height: 1.5;
}
</style>
