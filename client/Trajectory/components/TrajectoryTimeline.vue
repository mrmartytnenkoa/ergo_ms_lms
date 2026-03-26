<script setup>
import { Clock, MapPin } from 'lucide-vue-next'

defineProps({
  stages: { type: Array, default: () => [] }
})

const statusColor = (status) => {
  const map = { completed: '#198754', in_progress: '#0d6efd', planned: '#adb5bd' }
  return map[status] || '#adb5bd'
}

const statusLabel = (status) => {
  const map = { completed: 'Завершено', in_progress: 'В процессе', planned: 'Запланировано' }
  return map[status] || status
}

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
  <div class="timeline">
    <div
      v-for="(stage, index) in stages"
      :key="stage.id || index"
      class="timeline-item"
    >
      <div class="timeline-line-segment">
        <div
          v-if="index > 0"
          class="timeline-connector"
          :style="{ backgroundColor: statusColor(stage.status) }"
        />
        <div
          class="timeline-dot"
          :style="{
            backgroundColor: statusColor(stage.status),
            boxShadow: `0 0 0 4px ${statusColor(stage.status)}20`
          }"
        />
        <div
          v-if="index < stages.length - 1"
          class="timeline-connector"
          :style="{ backgroundColor: statusColor(stages[index + 1].status) }"
        />
      </div>

      <div class="timeline-content card mb-0">
        <div class="card-body py-2 px-3">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-1">
            <h6 class="mb-0">{{ stage.name }}</h6>
            <div class="d-flex gap-1">
              <span class="badge" :class="`bg-${typeVariant(stage.type)}`">
                {{ typeLabel(stage.type) }}
              </span>
              <span
                class="badge"
                :style="{
                  backgroundColor: statusColor(stage.status) + '1A',
                  color: statusColor(stage.status)
                }"
              >
                {{ statusLabel(stage.status) }}
              </span>
            </div>
          </div>

          <div v-if="stage.institution" class="d-flex align-items-center gap-1 mt-1 text-muted small">
            <MapPin :size="12" class="flex-shrink-0" />
            <span>{{ stage.institution }}</span>
          </div>

          <div v-if="stage.duration" class="d-flex align-items-center gap-1 mt-1 text-muted small">
            <Clock :size="12" class="flex-shrink-0" />
            <span>{{ stage.duration }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="stages.length === 0" class="text-center py-4 text-muted">
      Этапы траектории отсутствуют
    </div>
  </div>
</template>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
}
.timeline-item {
  display: flex;
  gap: 16px;
  min-height: 0;
}
.timeline-line-segment {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
  flex-shrink: 0;
}
.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  z-index: 1;
}
.timeline-connector {
  width: 2px;
  flex: 1;
  min-height: 12px;
  opacity: 0.4;
}
.timeline-content {
  flex: 1;
  margin-bottom: 12px;
  min-width: 0;
}
</style>
