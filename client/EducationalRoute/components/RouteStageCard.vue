<script setup>
import { computed } from 'vue'
import { Calendar, BookOpen, CheckCircle2, Clock, Circle } from 'lucide-vue-next'

const props = defineProps({
  stage: { type: Object, required: true },
  isLast: { type: Boolean, default: false }
})

const statusConfig = computed(() => {
  const map = {
    completed: { label: 'Завершён', badge: 'bg-success', border: 'border-success', icon: CheckCircle2 },
    current: { label: 'Текущий', badge: 'bg-primary', border: 'border-primary', icon: Clock },
    upcoming: { label: 'Предстоит', badge: 'bg-secondary', border: 'border-secondary', icon: Circle }
  }
  return map[props.stage.status] || map.upcoming
})

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="d-flex mb-0">
    <div class="d-flex flex-column align-items-center me-3" style="width: 24px;">
      <div
        class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
        :class="stage.status === 'completed' ? 'bg-success' : stage.status === 'current' ? 'bg-primary' : 'bg-secondary'"
        style="width: 24px; height: 24px;"
      >
        <component :is="statusConfig.icon" :size="14" class="text-white" />
      </div>
      <div
        v-if="!isLast"
        class="flex-grow-1"
        :class="stage.status === 'completed' ? 'bg-success' : 'bg-secondary'"
        style="width: 2px; min-height: 24px;"
      ></div>
    </div>

    <div class="card mb-3 flex-grow-1" :class="`border-start border-3 ${statusConfig.border}`">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h6 class="card-title mb-0">{{ stage.name }}</h6>
          <span class="badge ms-2 flex-shrink-0" :class="statusConfig.badge">
            {{ statusConfig.label }}
          </span>
        </div>

        <p class="text-muted small mb-2">{{ stage.description }}</p>

        <div v-if="stage.progress != null" class="mb-2">
          <div class="d-flex justify-content-between small mb-1">
            <span class="text-muted">Прогресс</span>
            <span>{{ stage.progress }}%</span>
          </div>
          <div class="progress" style="height: 5px;">
            <div
              class="progress-bar"
              :class="stage.status === 'completed' ? 'bg-success' : 'bg-primary'"
              :style="{ width: stage.progress + '%' }"
            ></div>
          </div>
        </div>

        <div class="d-flex align-items-center text-muted small mb-2">
          <Calendar :size="14" class="me-1 flex-shrink-0" />
          <span>{{ formatDate(stage.startDate) }} — {{ formatDate(stage.endDate) }}</span>
        </div>

        <div v-if="stage.courses?.length" class="mt-2">
          <small class="text-muted d-block mb-1">Курсы:</small>
          <span
            v-for="course in stage.courses"
            :key="course.id"
            class="badge bg-light text-dark me-1 mb-1"
          >
            <BookOpen :size="12" class="me-1 align-middle" />
            {{ course.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
