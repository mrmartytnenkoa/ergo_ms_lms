<script setup>
import { computed } from 'vue'
import { Clock, HelpCircle, Play } from 'lucide-vue-next'

const props = defineProps({
  test: { type: Object, required: true }
})

const emit = defineEmits(['start'])

const statusConfig = computed(() => {
  const map = {
    available: { label: 'Доступен', class: 'bg-success' },
    completed: { label: 'Пройден', class: 'bg-primary' },
    in_progress: { label: 'В процессе', class: 'bg-warning text-dark' }
  }
  return map[props.test.status] || { label: props.test.status, class: 'bg-secondary' }
})

const isStartDisabled = computed(() => props.test.status === 'completed')

const buttonLabel = computed(() => {
  if (props.test.status === 'completed') return 'Пройден'
  if (props.test.status === 'in_progress') return 'Продолжить'
  return 'Начать тест'
})
</script>

<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h6 class="card-title mb-0">{{ test.name }}</h6>
        <span class="badge ms-2 flex-shrink-0" :class="statusConfig.class">
          {{ statusConfig.label }}
        </span>
      </div>

      <p class="text-muted small mb-3 flex-grow-1">{{ test.description }}</p>

      <div class="d-flex align-items-center text-muted small mb-3">
        <Clock :size="14" class="me-1 flex-shrink-0" />
        <span class="me-3">{{ test.duration }} мин</span>
        <HelpCircle :size="14" class="me-1 flex-shrink-0" />
        <span>{{ test.questionsCount }} вопросов</span>
      </div>

      <button
        class="btn btn-sm w-100"
        :class="isStartDisabled ? 'btn-outline-secondary' : 'btn-primary'"
        :disabled="isStartDisabled"
        @click="emit('start', test.id)"
      >
        <Play :size="14" class="me-1 align-middle" />
        {{ buttonLabel }}
      </button>
    </div>
  </div>
</template>
