<template>
  <div class="monitoring-page">
    <div class="container-fluid py-4">
      <h1 class="h3 mb-4">Мониторинг профориентации</h1>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>

      <template v-else-if="data">
        <ul class="nav nav-tabs mb-4">
          <li v-for="tab in tabs" :key="tab.key" class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              <component :is="tab.icon" :size="16" class="me-1 align-middle" />
              {{ tab.label }}
            </button>
          </li>
        </ul>

        <div v-if="activeTab === 'coverage'">
          <CoverageStatsCards :coverage="data.coverage" />
        </div>

        <div v-else-if="activeTab === 'engagement'">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h5 class="mb-0">Вовлеченность по месяцам</h5>
            </div>
            <div class="card-body">
              <EngagementChart :data="data.engagement" />
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'risk'">
          <RiskGroupTable :students="data.riskGroups" />
        </div>

        <div class="card border-0 shadow-sm mt-4">
          <div class="card-header bg-white">
            <h5 class="mb-0">Спрос на профессии</h5>
          </div>
          <div class="card-body">
            <ProfessionDemandChart :data="data.professionDemand" />
          </div>
        </div>
      </template>

      <div v-else class="alert alert-warning">
        Не удалось загрузить данные мониторинга.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, markRaw } from 'vue'
import { PieChart, TrendingUp, AlertTriangle } from 'lucide-vue-next'
import { lmsApi } from '../js/lmsApi.js'
import CoverageStatsCards from './components/CoverageStatsCards.vue'
import EngagementChart from './components/EngagementChart.vue'
import RiskGroupTable from './components/RiskGroupTable.vue'
import ProfessionDemandChart from './components/ProfessionDemandChart.vue'

const loading = ref(false)
const data = ref(null)
const activeTab = ref('coverage')

const tabs = [
  { key: 'coverage', label: 'Охват', icon: markRaw(PieChart) },
  { key: 'engagement', label: 'Вовлеченность', icon: markRaw(TrendingUp) },
  { key: 'risk', label: 'Группы риска', icon: markRaw(AlertTriangle) }
]

async function loadData() {
  loading.value = true
  try {
    const response = await lmsApi.getMonitoringData()
    data.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки данных мониторинга:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
