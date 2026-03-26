<script setup>
import { ref, onMounted } from 'vue'
import { lmsApi } from '../js/lmsApi.js'
import { Loader2, BarChart3 } from 'lucide-vue-next'
import QualityMetricsCards from './components/QualityMetricsCards.vue'
import EventAnalyticsTable from './components/EventAnalyticsTable.vue'
import TrendChart from './components/TrendChart.vue'

const loading = ref(true)
const error = ref(null)
const kpis = ref({})
const events = ref([])
const trends = ref([])

async function loadData() {
  loading.value = true
  error.value = null
  try {
    const res = await lmsApi.getCareerAnalytics()
    const data = res.data
    kpis.value = data.kpis || {}
    events.value = data.eventMetrics || []
    trends.value = data.trends || []
  } catch (e) {
    error.value = 'Не удалось загрузить данные аналитики'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center mb-4">
      <BarChart3 :size="28" class="me-2 text-primary" />
      <h2 class="mb-0">Аналитика карьерного ориентирования</h2>
    </div>

    <div v-if="loading" class="text-center py-5">
      <Loader2 :size="40" class="spinner-icon text-primary" />
      <p class="mt-3 text-muted">Загрузка данных...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <template v-else>
      <QualityMetricsCards :kpis="kpis" class="mb-4" />

      <div class="row g-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">Аналитика мероприятий</h5>
            </div>
            <div class="card-body">
              <EventAnalyticsTable :events="events" />
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-white">
              <h5 class="card-title mb-0">Тренды</h5>
            </div>
            <div class="card-body">
              <TrendChart :data="trends" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.spinner-icon {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
