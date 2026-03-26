<script setup>
import { ref, computed, onMounted } from 'vue'
import { lmsApi } from '../js/lmsApi.js'
import { FileText, Loader2 } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import ReportTemplateSelector from './components/ReportTemplateSelector.vue'
import ReportFilters from './components/ReportFilters.vue'
import ReportPreview from './components/ReportPreview.vue'

const toast = useToast()

const loading = ref(true)
const error = ref(null)
const templates = ref([])
const selectedTemplateId = ref(null)
const currentStep = ref(1)
const report = ref(null)

const selectedTemplate = computed(() =>
  templates.value.find(t => t.id === selectedTemplateId.value)
)

const steps = [
  { num: 1, label: 'Выбор шаблона' },
  { num: 2, label: 'Настройка фильтров' },
  { num: 3, label: 'Предварительный просмотр' }
]

async function loadTemplates() {
  loading.value = true
  error.value = null
  try {
    const res = await lmsApi.getReportTemplates()
    templates.value = res.data
  } catch (e) {
    error.value = 'Не удалось загрузить шаблоны отчётов'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function goToFilters() {
  if (!selectedTemplateId.value) {
    toast.warning('Выберите шаблон отчёта')
    return
  }
  currentStep.value = 2
}

function onApplyFilters(filters) {
  report.value = {
    template: selectedTemplate.value,
    filters,
    generatedAt: new Date().toLocaleString('ru-RU'),
    sections: selectedTemplate.value?.sections || []
  }
  currentStep.value = 3
}

function goBack() {
  if (currentStep.value > 1) currentStep.value--
}

onMounted(loadTemplates)
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center mb-4">
      <FileText :size="28" class="me-2 text-primary" />
      <h2 class="mb-0">Генерация отчётов</h2>
    </div>

    <div class="d-flex justify-content-center mb-4">
      <div
        v-for="step in steps"
        :key="step.num"
        class="d-flex align-items-center"
      >
        <div class="text-center">
          <div
            class="rounded-circle d-inline-flex align-items-center justify-content-center"
            :class="currentStep >= step.num
              ? 'bg-primary text-white'
              : 'bg-light text-muted border'"
            style="width: 36px; height: 36px"
          >
            {{ step.num }}
          </div>
          <div class="small mt-1" :class="currentStep >= step.num ? 'text-primary fw-medium' : 'text-muted'">
            {{ step.label }}
          </div>
        </div>
        <div
          v-if="step.num < steps.length"
          class="mx-3 border-top"
          :class="currentStep > step.num ? 'border-primary' : 'border-secondary'"
          style="width: 60px; margin-top: -14px"
        />
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <Loader2 :size="40" class="spinner-icon text-primary" />
      <p class="mt-3 text-muted">Загрузка шаблонов...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <template v-else>
      <div v-if="currentStep === 1">
        <ReportTemplateSelector
          v-model="selectedTemplateId"
          :templates="templates"
        />
        <div class="text-end mt-3">
          <button class="btn btn-primary" @click="goToFilters">Далее</button>
        </div>
      </div>

      <div v-else-if="currentStep === 2">
        <ReportFilters :template="selectedTemplate" @apply="onApplyFilters" />
        <div class="mt-3">
          <button class="btn btn-outline-secondary me-2" @click="goBack">Назад</button>
        </div>
      </div>

      <div v-else-if="currentStep === 3">
        <ReportPreview :report="report" />
        <div class="mt-3">
          <button class="btn btn-outline-secondary" @click="goBack">Назад</button>
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
