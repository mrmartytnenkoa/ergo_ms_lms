<template>
  <div class="gap-analysis-page">
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Анализ разрывов</h1>
        <button class="btn btn-outline-primary btn-sm" @click="loadData">
          <RefreshCw :size="16" class="me-1 align-middle" />
          Обновить
        </button>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>

      <template v-else-if="analysis">
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="bg-primary bg-opacity-10 rounded p-3 flex-shrink-0">
                    <Users class="text-primary" :size="24" />
                  </div>
                  <div class="ms-3">
                    <div class="text-muted small">Всего студентов</div>
                    <div class="h4 mb-0">{{ analysis.summary.totalStudents }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="bg-warning bg-opacity-10 rounded p-3 flex-shrink-0">
                    <BarChart3 class="text-warning" :size="24" />
                  </div>
                  <div class="ms-3">
                    <div class="text-muted small">Средний разрыв</div>
                    <div class="h4 mb-0">{{ analysis.summary.avgGap }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="bg-danger bg-opacity-10 rounded p-3 flex-shrink-0">
                    <AlertTriangle class="text-danger" :size="24" />
                  </div>
                  <div class="ms-3">
                    <div class="text-muted small">Критические разрывы</div>
                    <div class="h4 mb-0">{{ analysis.summary.criticalGaps }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0">Сравнение интересов студентов и спроса работодателей</h5>
          </div>
          <div class="card-body">
            <GapChart :gaps="analysis.gaps" />
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-7">
            <GapComparisonTable :gaps="analysis.gaps" />
          </div>
          <div class="col-lg-5">
            <GapRecommendations :recommendations="analysis.recommendations" />
          </div>
        </div>
      </template>

      <div v-else class="alert alert-warning">
        Не удалось загрузить данные анализа разрывов.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Users, BarChart3, AlertTriangle, RefreshCw } from 'lucide-vue-next'
import { lmsApi } from '../js/lmsApi.js'
import GapChart from './components/GapChart.vue'
import GapComparisonTable from './components/GapComparisonTable.vue'
import GapRecommendations from './components/GapRecommendations.vue'

const loading = ref(false)
const analysis = ref(null)

async function loadData() {
  loading.value = true
  try {
    const response = await lmsApi.getGapAnalysis()
    analysis.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки анализа разрывов:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
