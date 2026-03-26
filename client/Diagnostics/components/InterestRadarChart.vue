<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  interests: { type: Array, required: true }
})

const chartSeries = computed(() => [{
  name: 'Интерес',
  data: props.interests.map(i => i.score)
}])

const chartOptions = computed(() => ({
  chart: {
    type: 'radar',
    toolbar: { show: false }
  },
  xaxis: {
    categories: props.interests.map(i => i.name)
  },
  yaxis: {
    show: false,
    max: 100
  },
  markers: { size: 4 },
  fill: { opacity: 0.25 },
  stroke: { width: 2 },
  colors: ['#0d6efd'],
  tooltip: {
    y: { formatter: val => `${val}%` }
  }
}))
</script>

<template>
  <div class="card h-100">
    <div class="card-header">
      <h6 class="mb-0">Профиль интересов</h6>
    </div>
    <div class="card-body d-flex align-items-center justify-content-center">
      <div v-if="interests.length === 0" class="text-muted text-center py-4">
        Нет данных для отображения
      </div>
      <VueApexCharts
        v-else
        type="radar"
        height="320"
        width="100%"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
  </div>
</template>
