<script setup>
import { computed } from 'vue'
import { Award, TrendingUp, Lightbulb } from 'lucide-vue-next'

const props = defineProps({
  results: { type: Object, required: true }
})

const scoreColor = computed(() => {
  const s = props.results.overallScore
  if (s >= 80) return 'text-success'
  if (s >= 60) return 'text-primary'
  if (s >= 40) return 'text-warning'
  return 'text-danger'
})

function abilityBarVariant(level) {
  const map = { 'высокий': 'bg-success', 'выше среднего': 'bg-primary', 'средний': 'bg-warning' }
  return map[level] || 'bg-secondary'
}
</script>

<template>
  <div class="card h-100">
    <div class="card-header">
      <h6 class="mb-0">
        <Award :size="18" class="me-2 align-middle text-primary" />
        Сводка результатов
      </h6>
    </div>
    <div class="card-body">
      <div class="text-center mb-4">
        <div class="display-4 fw-bold" :class="scoreColor">{{ results.overallScore }}</div>
        <small class="text-muted">Общий балл диагностики</small>
      </div>

      <div v-if="results.abilities?.length" class="mb-4">
        <h6 class="d-flex align-items-center mb-3">
          <TrendingUp :size="16" class="me-2 text-primary" />
          Способности
        </h6>
        <div v-for="ability in results.abilities" :key="ability.name" class="mb-2">
          <div class="d-flex justify-content-between small mb-1">
            <span>{{ ability.name }}</span>
            <span class="text-muted">{{ ability.score }}%</span>
          </div>
          <div class="progress" style="height: 6px;">
            <div
              class="progress-bar"
              :class="abilityBarVariant(ability.level)"
              :style="{ width: ability.score + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <div v-if="results.recommendations?.length">
        <h6 class="d-flex align-items-center mb-3">
          <Lightbulb :size="16" class="me-2 text-warning" />
          Рекомендации
        </h6>
        <ul class="list-unstyled mb-0">
          <li
            v-for="(rec, idx) in results.recommendations"
            :key="idx"
            class="d-flex align-items-start mb-2"
          >
            <span class="badge bg-light text-primary me-2 mt-1">{{ idx + 1 }}</span>
            <small>{{ rec }}</small>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
