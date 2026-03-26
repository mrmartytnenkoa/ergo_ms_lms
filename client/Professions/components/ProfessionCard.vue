<script setup>
import { computed } from 'vue'
import { Banknote, TrendingUp } from 'lucide-vue-next'

const props = defineProps({
  profession: { type: Object, required: true }
})

defineEmits(['click'])

const demandVariant = computed(() => {
  const map = { high: 'success', medium: 'warning', low: 'danger' }
  return map[props.profession.demand] || 'secondary'
})

const demandLabel = computed(() => {
  const map = { high: 'Высокий спрос', medium: 'Средний спрос', low: 'Низкий спрос' }
  return map[props.profession.demand] || props.profession.demand
})

const formattedSalary = computed(() => {
  if (!props.profession.avgSalary) return '—'
  return props.profession.avgSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' \u20BD'
})

const matchPercent = computed(() => Math.round(props.profession.matchScore || 0))

const progressVariant = computed(() => {
  if (matchPercent.value >= 70) return 'bg-success'
  if (matchPercent.value >= 40) return 'bg-warning'
  return 'bg-danger'
})
</script>

<template>
  <div class="card h-100 profession-card" role="button" @click="$emit('click')">
    <div class="card-body d-flex flex-column">
      <h6 class="card-title mb-2">{{ profession.name }}</h6>

      <div class="d-flex flex-wrap gap-1 mb-2">
        <span class="badge bg-primary bg-opacity-10 text-primary">{{ profession.field }}</span>
        <span class="badge" :class="`bg-${demandVariant} bg-opacity-10 text-${demandVariant}`">
          {{ demandLabel }}
        </span>
      </div>

      <div class="d-flex align-items-center gap-1 mb-2 text-muted small">
        <Banknote :size="14" class="flex-shrink-0" />
        <span>{{ formattedSalary }}</span>
      </div>

      <div class="mb-2">
        <div class="d-flex justify-content-between align-items-center mb-1 small">
          <span class="d-flex align-items-center gap-1 text-muted">
            <TrendingUp :size="14" class="flex-shrink-0" />
            Совпадение
          </span>
          <span class="fw-semibold">{{ matchPercent }}%</span>
        </div>
        <div class="progress" style="height: 6px;">
          <div
            class="progress-bar"
            :class="progressVariant"
            role="progressbar"
            :style="{ width: matchPercent + '%' }"
            :aria-valuenow="matchPercent"
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>

      <p class="card-text text-muted small mb-0 description-clamp">
        {{ profession.description }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.profession-card {
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
}
.profession-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
