<template>
  <div class="profession-demand-chart">
    <VueApexCharts
      type="bar"
      :height="chartHeight"
      :options="chartOptions"
      :series="series"
    />
    <div class="d-flex gap-3 justify-content-center mt-2">
      <small class="text-muted">
        <TrendingUp :size="14" class="text-success me-1 align-middle" />
        Рост
      </small>
      <small class="text-muted">
        <TrendingDown :size="14" class="text-danger me-1 align-middle" />
        Снижение
      </small>
      <small class="text-muted">
        <Minus :size="14" class="text-secondary me-1 align-middle" />
        Стабильно
      </small>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const trendColors = { up: '#198754', down: '#dc3545', stable: '#6c757d' }

const chartHeight = computed(() => Math.max(300, props.data.length * 45))

const series = computed(() => [{
  name: 'Спрос',
  data: props.data.map(d => d.demand)
}])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '55%',
      borderRadius: 4,
      distributed: true
    }
  },
  colors: props.data.map(d => trendColors[d.trend] || trendColors.stable),
  dataLabels: {
    enabled: true,
    formatter: val => `${val}%`,
    style: { fontSize: '11px', colors: ['#fff'] }
  },
  xaxis: {
    categories: props.data.map(d => d.name),
    max: 100,
    labels: { formatter: val => `${val}%` }
  },
  yaxis: {
    labels: { style: { fontSize: '12px' } }
  },
  tooltip: {
    y: { formatter: val => `${val}%` }
  },
  legend: { show: false },
  grid: { borderColor: '#f1f1f1' }
}))
</script>
