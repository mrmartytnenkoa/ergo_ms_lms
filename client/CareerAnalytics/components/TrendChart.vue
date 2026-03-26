<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const series = computed(() => [
  {
    name: 'Мероприятия',
    type: 'line',
    data: props.data.map(d => d.events)
  },
  {
    name: 'Участники',
    type: 'line',
    data: props.data.map(d => d.participants)
  },
  {
    name: 'Удовлетворенность (%)',
    type: 'line',
    data: props.data.map(d => d.satisfaction)
  }
])

const chartOptions = computed(() => ({
  chart: {
    height: 350,
    toolbar: { show: true },
    zoom: { enabled: false },
    fontFamily: 'inherit'
  },
  stroke: {
    width: [3, 3, 3],
    curve: 'smooth'
  },
  colors: ['#0d6efd', '#198754', '#fd7e14'],
  xaxis: {
    categories: props.data.map(d => d.month)
  },
  yaxis: [
    {
      title: { text: 'Мероприятия' },
      min: 0
    },
    {
      opposite: true,
      title: { text: 'Участники' },
      min: 0
    },
    {
      opposite: true,
      show: false,
      min: 0,
      max: 100
    }
  ],
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  tooltip: {
    shared: true,
    intersect: false
  },
  grid: {
    borderColor: '#f1f1f1'
  },
  markers: {
    size: 4,
    hover: { sizeOffset: 2 }
  }
}))

const isEmpty = computed(() => props.data.length === 0)
</script>

<template>
  <div>
    <div v-if="isEmpty" class="text-center text-muted py-4">
      Нет данных для отображения графика
    </div>
    <VueApexCharts
      v-else
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>
