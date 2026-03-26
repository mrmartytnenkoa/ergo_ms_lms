<script setup>
import { ref, onMounted } from 'vue'
import { ClipboardList, BarChart3, GraduationCap } from 'lucide-vue-next'
import { lmsApi } from '../js/lmsApi.js'
import DiagnosticTestCard from './components/DiagnosticTestCard.vue'
import DiagnosticResultsSummary from './components/DiagnosticResultsSummary.vue'
import InterestRadarChart from './components/InterestRadarChart.vue'
import LearningResultsSummary from './components/LearningResultsSummary.vue'

const activeTab = ref('tests')
const tests = ref([])
const results = ref(null)
const learningSummary = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const [testsRes, resultsRes, learningRes] = await Promise.all([
      lmsApi.getDiagnosticTests(),
      lmsApi.getDiagnosticResults(),
      lmsApi.getLearningResults()
    ])
    tests.value = testsRes.data
    results.value = resultsRes.data
    learningSummary.value = learningRes.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center mb-4">
      <ClipboardList :size="24" class="me-2 text-primary" />
      <h4 class="mb-0">Диагностика</h4>
    </div>

    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'tests' }"
          @click="activeTab = 'tests'"
        >
          <ClipboardList :size="16" class="me-1 align-middle" />
          Доступные тесты
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'results' }"
          @click="activeTab = 'results'"
        >
          <BarChart3 :size="16" class="me-1 align-middle" />
          Результаты
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'learning' }"
          @click="activeTab = 'learning'"
        >
          <GraduationCap :size="16" class="me-1 align-middle" />
          Результаты обучения
        </button>
      </li>
    </ul>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Загрузка данных...</p>
    </div>

    <template v-else>
      <div v-if="activeTab === 'tests'">
        <div v-if="tests.length === 0" class="text-center text-muted py-5">
          Нет доступных тестов
        </div>
        <div v-else class="row g-3">
          <div v-for="test in tests" :key="test.id" class="col-md-6 col-lg-4">
            <DiagnosticTestCard :test="test" />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'results' && results">
        <div class="row g-4">
          <div class="col-lg-6">
            <DiagnosticResultsSummary :results="results" />
          </div>
          <div class="col-lg-6">
            <InterestRadarChart :interests="results.interestsProfile || []" />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'learning'">
        <LearningResultsSummary v-if="learningSummary" :summary="learningSummary" />
        <div v-else class="text-center text-muted py-5">
          Нет данных по результатам обучения
        </div>
      </div>
    </template>
  </div>
</template>
