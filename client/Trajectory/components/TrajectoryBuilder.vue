<script setup>
import { GripVertical } from 'lucide-vue-next'

defineProps({
  stages: { type: Array, default: () => [] }
})

const typeVariant = (type) => {
  const map = { education: 'primary', practice: 'success', certification: 'info' }
  return map[type] || 'secondary'
}

const typeLabel = (type) => {
  const map = { education: 'Обучение', practice: 'Практика', certification: 'Сертификация' }
  return map[type] || type
}
</script>

<template>
  <div class="d-flex flex-column gap-2">
    <div
      v-for="(stage, index) in stages"
      :key="stage.id || index"
      class="card stage-card"
    >
      <div class="card-body d-flex align-items-center gap-3 py-2 px-3">
        <div class="drag-handle text-muted" role="button" title="Перетащите для изменения порядка">
          <GripVertical :size="18" />
        </div>

        <span class="badge rounded-pill bg-light text-dark border">{{ index + 1 }}</span>

        <div class="flex-grow-1 min-width-0">
          <div class="fw-semibold text-truncate">{{ stage.name }}</div>
          <div class="text-muted small text-truncate">{{ stage.institution }}</div>
        </div>

        <span class="badge" :class="`bg-${typeVariant(stage.type)}`">
          {{ typeLabel(stage.type) }}
        </span>

        <span v-if="stage.duration" class="text-muted small text-nowrap">
          {{ stage.duration }}
        </span>
      </div>
    </div>

    <div v-if="stages.length === 0" class="text-center py-4 text-muted">
      Этапы не добавлены
    </div>
  </div>
</template>

<style scoped>
.stage-card {
  cursor: grab;
  transition: box-shadow 0.15s;
}
.stage-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.drag-handle {
  cursor: grab;
}
.min-width-0 {
  min-width: 0;
}
</style>
