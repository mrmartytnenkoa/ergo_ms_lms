<script setup>
import { Lightbulb } from 'lucide-vue-next'

defineProps({
  recommendations: { type: Array, default: () => [] }
})
</script>

<template>
  <div class="card h-100">
    <div class="card-header">
      <h6 class="mb-0 d-flex align-items-center gap-2">
        <Lightbulb :size="16" class="flex-shrink-0 text-warning" />
        Рекомендации
      </h6>
    </div>
    <div class="card-body">
      <ul v-if="recommendations.length" class="list-unstyled mb-0">
        <li
          v-for="(rec, index) in recommendations"
          :key="index"
          class="d-flex align-items-start gap-2 mb-3"
          :class="{ 'mb-0': index === recommendations.length - 1 }"
        >
          <Lightbulb :size="14" class="flex-shrink-0 text-warning mt-1" />
          <span class="small">{{ rec }}</span>
        </li>
      </ul>
      <p v-else class="text-muted small mb-0">Рекомендации пока отсутствуют</p>
    </div>
  </div>
</template>
