<template>
  <div class="engagement-chart">
    <VueApexCharts
      type="line"
      :height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const series = computed(() => [
  {
    name: 'Участие',
    data: props.data.map(d => d.participation)
  },
  {
    name: 'Удовлетворенность',
    data: props.data.map(d => d.satisfaction)
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
    fontFamily: 'inherit',
    zoom: { enabled: false }
  },
  colors: ['#0d6efd', '#198754'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  markers: {
    size: 5,
    hover: { sizeOffset: 2 }
  },
  xaxis: {
    categories: props.data.map(d => d.month)
  },
  yaxis: {
    min: 0,
    max: 100,
    labels: {
      formatter: val => `${val}%`
    }
  },
  tooltip: {
    y: {
      formatter: val => `${val}%`
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center'
  },
  grid: {
    borderColor: '#f1f1f1'
  }
}))
</script>
