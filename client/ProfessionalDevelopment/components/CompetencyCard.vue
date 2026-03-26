<script setup>
import { computed } from 'vue'
import { TrendingUp } from 'lucide-vue-next'

const props = defineProps({
  competency: { type: Object, required: true }
})

const categoryVariant = computed(() => {
  const map = {
    'Технические': 'bg-primary',
    'Фундаментальные': 'bg-info',
    'Гибкие навыки': 'bg-success',
    'Языковые': 'bg-warning text-dark'
  }
  return map[props.competency.category] || 'bg-secondary'
})

const progressVariant = computed(() => {
  const p = props.competency.progress
  if (p >= 75) return 'bg-success'
  if (p >= 50) return 'bg-primary'
  if (p >= 25) return 'bg-warning'
  return 'bg-danger'
})
</script>

<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h6 class="card-title mb-0">{{ competency.name }}</h6>
        <span class="badge ms-2 flex-shrink-0" :class="categoryVariant">
          {{ competency.category }}
        </span>
      </div>

      <p class="text-muted small mb-3 flex-grow-1">{{ competency.description }}</p>

      <div class="d-flex align-items-center mb-2">
        <TrendingUp :size="16" class="me-2 text-primary" />
        <span class="fw-semibold">
          Уровень {{ competency.currentLevel }}/{{ competency.targetLevel }}
        </span>
      </div>

      <div class="progress" style="height: 6px;">
        <div
          class="progress-bar"
          :class="progressVariant"
          :style="{ width: competency.progress + '%' }"
        ></div>
      </div>
      <small class="text-muted text-end mt-1">{{ competency.progress }}%</small>
    </div>
  </div>
</template>
