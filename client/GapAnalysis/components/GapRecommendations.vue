<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white">
      <h5 class="mb-0">Рекомендации</h5>
    </div>
    <div class="card-body">
      <ol class="list-unstyled mb-0">
        <li
          v-for="(rec, index) in recommendations"
          :key="index"
          class="d-flex align-items-start mb-3"
        >
          <div class="flex-shrink-0 me-3 mt-1">
            <component
              :is="index < 2 ? AlertTriangle : Lightbulb"
              :size="18"
              :class="index < 2 ? 'text-warning' : 'text-info'"
              class="align-middle"
            />
          </div>
          <div>
            <span class="badge bg-secondary me-2">{{ index + 1 }}</span>
            {{ rec }}
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle, Lightbulb } from 'lucide-vue-next'

defineProps({
  recommendations: {
    type: Array,
    required: true
  }
})
</script>
