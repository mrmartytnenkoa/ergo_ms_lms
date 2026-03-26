<script setup>
import { computed } from 'vue'
import { TrendingUp, Users, Target, SmilePlus } from 'lucide-vue-next'

const props = defineProps({
  kpis: {
    type: Object,
    default: () => ({})
  }
})

const npsColor = computed(() => {
  const val = props.kpis.nps ?? 0
  if (val >= 70) return 'text-success'
  if (val >= 40) return 'text-warning'
  return 'text-danger'
})

const cards = computed(() => [
  {
    label: 'NPS',
    value: props.kpis.nps ?? 0,
    suffix: '',
    icon: TrendingUp,
    colorClass: npsColor.value,
    bg: 'bg-primary bg-opacity-10'
  },
  {
    label: 'Охват',
    value: props.kpis.coverage ?? 0,
    suffix: '%',
    icon: Users,
    colorClass: 'text-info',
    bg: 'bg-info bg-opacity-10'
  },
  {
    label: 'Конверсия',
    value: props.kpis.conversion ?? 0,
    suffix: '%',
    icon: Target,
    colorClass: 'text-primary',
    bg: 'bg-success bg-opacity-10'
  },
  {
    label: 'Удовлетворенность',
    value: props.kpis.satisfaction ?? 0,
    suffix: '%',
    icon: SmilePlus,
    colorClass: 'text-success',
    bg: 'bg-warning bg-opacity-10'
  }
])
</script>

<template>
  <div class="row g-3">
    <div v-for="card in cards" :key="card.label" class="col-6 col-md-3">
      <div class="card shadow-sm h-100 border-0">
        <div class="card-body d-flex align-items-center">
          <div :class="['rounded-3 p-3 me-3', card.bg]">
            <component :is="card.icon" :size="24" :class="card.colorClass" />
          </div>
          <div>
            <div class="text-muted small">{{ card.label }}</div>
            <div :class="['fs-3 fw-bold', card.colorClass]">
              {{ card.value }}{{ card.suffix }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
