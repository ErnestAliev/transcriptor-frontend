<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  regenerating: {
    type: Boolean,
    default: false
  }
});

defineEmits(["regenerate"]);

function hasItems(items) {
  return Array.isArray(items) && items.length > 0;
}
</script>

<template>
  <section class="panel summary-panel">
    <div class="summary-header">
      <div>
        <p class="eyebrow">Выжимка</p>
        <h2>{{ item?.summary?.headline || "Структурированная сводка" }}</h2>
      </div>

      <button
        class="secondary-button"
        type="button"
        :disabled="!item || loading || regenerating"
        @click="$emit('regenerate')"
      >
        {{ regenerating ? "Пересобираем..." : "Обновить" }}
      </button>
    </div>

    <div v-if="loading" class="panel-state">Загружаем выжимку...</div>
    <div v-else-if="!item" class="panel-state">Структурированная сводка появится здесь.</div>
    <div v-else-if="!item.summary" class="panel-state">
      Сводка станет доступна после успешной обработки файла.
    </div>
    <template v-else>
      <section class="summary-section hero">
        <p>{{ item.summary.overview || "Модель не вернула обзор." }}</p>
      </section>

      <section class="summary-section">
        <h3>Ключевые факты</h3>
        <ul v-if="hasItems(item.summary.keyFacts)" class="list">
          <li v-for="fact in item.summary.keyFacts" :key="fact">{{ fact }}</li>
        </ul>
        <p v-else class="muted">Факты не выделены.</p>
      </section>

      <section class="summary-section">
        <h3>Даты</h3>
        <ul v-if="hasItems(item.summary.dates)" class="list">
          <li v-for="fact in item.summary.dates" :key="`${fact.value}-${fact.context}`">
            <strong>{{ fact.value }}</strong>
            <span>{{ fact.context }}</span>
          </li>
        </ul>
        <p v-else class="muted">Явные даты не найдены.</p>
      </section>

      <section class="summary-section">
        <h3>Суммы и числа</h3>
        <ul v-if="hasItems(item.summary.amountsAndNumbers)" class="list">
          <li
            v-for="fact in item.summary.amountsAndNumbers"
            :key="`${fact.value}-${fact.context}`"
          >
            <strong>{{ fact.value }}</strong>
            <span>{{ fact.context }}</span>
          </li>
        </ul>
        <p v-else class="muted">Суммы и числовые факты не найдены.</p>
      </section>

      <section class="summary-section">
        <h3>Участники</h3>
        <ul v-if="hasItems(item.summary.participants)" class="list">
          <li
            v-for="person in item.summary.participants"
            :key="`${person.name}-${person.role}`"
          >
            <strong>{{ person.name || "Без имени" }}</strong>
            <span>{{ person.role || "Роль не указана" }}</span>
          </li>
        </ul>
        <p v-else class="muted">Участники не выделены.</p>
      </section>

      <section class="summary-section">
        <h3>Следующие действия</h3>
        <ul v-if="hasItems(item.summary.actionItems)" class="list">
          <li v-for="action in item.summary.actionItems" :key="action">{{ action }}</li>
        </ul>
        <p v-else class="muted">Action items не выявлены.</p>
      </section>

      <section class="summary-section">
        <h3>Теги</h3>
        <div v-if="hasItems(item.summary.tags)" class="tag-list">
          <span v-for="tag in item.summary.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <p v-else class="muted">Теги не заданы.</p>
      </section>

      <section v-if="hasItems(item.summary.cautionNotes)" class="summary-section caution">
        <h3>Нюансы и сомнительные места</h3>
        <ul class="list">
          <li v-for="note in item.summary.cautionNotes" :key="note">{{ note }}</li>
        </ul>
      </section>
    </template>
  </section>
</template>

<style scoped>
.panel {
  display: grid;
  align-content: start;
  gap: 1rem;
  min-height: 0;
  padding: 1.4rem;
  border: 1px solid var(--border);
  border-radius: 28px;
  background: var(--panel);
  box-shadow: var(--shadow-card);
  overflow: auto;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}

.eyebrow {
  margin: 0 0 0.35rem;
  font: 600 0.73rem/1 "IBM Plex Mono", monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}

.summary-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.secondary-button {
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--border-strong);
  border-radius: 15px;
  background: var(--panel-elevated);
  color: var(--text-main);
  font-weight: 700;
  cursor: pointer;
}

.secondary-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.panel-state {
  display: grid;
  place-items: center;
  min-height: 220px;
  color: var(--text-muted);
  border: 1px dashed var(--border);
  border-radius: 20px;
}

.summary-section {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 20px;
  background: var(--panel-elevated);
}

.summary-section.hero {
  background:
    radial-gradient(circle at top left, var(--accent-soft), transparent 45%),
    var(--panel-elevated);
}

.summary-section.caution {
  background: var(--danger-soft);
}

.summary-section h3 {
  margin: 0;
  font-size: 0.95rem;
}

.summary-section p {
  margin: 0;
  line-height: 1.6;
}

.list {
  margin: 0;
  padding-left: 1.15rem;
  display: grid;
  gap: 0.75rem;
}

.list li {
  display: grid;
  gap: 0.2rem;
  line-height: 1.5;
}

.list strong {
  font-size: 0.93rem;
}

.muted {
  color: var(--text-muted);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.tag {
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  background: var(--chip-bg);
  font: 600 0.74rem/1 "IBM Plex Mono", monospace;
}
</style>
