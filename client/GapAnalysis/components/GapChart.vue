<template>
  <div class="gap-chart">
    <VueApexCharts
      type="bar"
      :height="chartHeight"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  gaps: {
    type: Array,
    required: true
  }
})

const chartHeight = computed(() => Math.max(300, props.gaps.length * 50))

const series = computed(() => [
  {
    name: 'Интерес студентов',
    data: props.gaps.map(g => g.studentInterest)
  },
  {
    name: 'Спрос работодателей',
    data: props.gaps.map(g => g.employerDemand)
  }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '60%',
      borderRadius: 4
    }
  },
  colors: ['#0d6efd', '#fd7e14'],
  dataLabels: {
    enabled: true,
    formatter: val => `${val}%`,
    style: { fontSize: '11px' }
  },
  xaxis: {
    categories: props.gaps.map(g => g.specialization),
    max: 100,
    labels: {
      formatter: val => `${val}%`
    }
  },
  yaxis: {
    labels: {
      style: { fontSize: '12px' }
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
