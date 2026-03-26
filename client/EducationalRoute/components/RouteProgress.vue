<script setup>
import { computed } from 'vue'
import { CheckCircle2, Target } from 'lucide-vue-next'

const props = defineProps({
  stages: { type: Array, required: true }
})

const completedCount = computed(() => props.stages.filter(s => s.status === 'completed').length)
const totalCount = computed(() => props.stages.length)
const percentage = computed(() => totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100))
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="d-flex align-items-center">
          <Target :size="20" class="me-2 text-primary" />
          <h6 class="mb-0">Общий прогресс</h6>
        </div>
        <div class="d-flex align-items-center">
          <CheckCircle2 :size="16" class="me-1 text-success" />
          <span class="fw-semibold">{{ completedCount }} / {{ totalCount }}</span>
          <span class="text-muted ms-1">этапов</span>
        </div>
      </div>
      <div class="progress" style="height: 10px;">
        <div
          class="progress-bar bg-success"
          :style="{ width: percentage + '%' }"
        ></div>
      </div>
      <small class="text-muted mt-1 d-block text-end">{{ percentage }}% завершено</small>
    </div>
  </div>
</template>
