<script setup>
import { Download, FileCheck, Calendar, Layers } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  report: {
    type: Object,
    default: () => ({})
  }
})

function filtersLabel() {
  const f = props.report?.filters
  if (!f) return 'Не указаны'
  const parts = []
  if (f.dateFrom) parts.push(`с ${f.dateFrom}`)
  if (f.dateTo) parts.push(`по ${f.dateTo}`)
  if (f.format) parts.push(`формат: ${f.format.toUpperCase()}`)
  return parts.length ? parts.join(', ') : 'Не указаны'
}

function handleDownload() {
  toast.success('Отчёт будет скачан после генерации на сервере')
}
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header bg-white d-flex align-items-center">
      <FileCheck :size="18" class="me-2 text-success" />
      <h5 class="card-title mb-0">Предварительный просмотр отчёта</h5>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <h6 class="fw-semibold">{{ report?.template?.name || 'Без названия' }}</h6>
        <p class="text-muted small mb-0">
          {{ report?.template?.description }}
        </p>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-12 col-md-6">
          <div class="d-flex align-items-center text-muted small">
            <Calendar :size="16" class="me-2" />
            <span>Дата формирования: {{ report?.generatedAt || '-' }}</span>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="d-flex align-items-center text-muted small">
            <Layers :size="16" class="me-2" />
            <span>Параметры: {{ filtersLabel() }}</span>
          </div>
        </div>
      </div>

      <div v-if="report?.sections?.length" class="mb-3">
        <label class="form-label text-muted small">Разделы отчёта:</label>
        <ul class="list-group list-group-flush">
          <li
            v-for="(section, idx) in report.sections"
            :key="idx"
            class="list-group-item px-0 py-2"
          >
            {{ section }}
          </li>
        </ul>
      </div>

      <div class="text-end">
        <button class="btn btn-success" @click="handleDownload">
          <Download :size="16" class="me-1" />
          Скачать
        </button>
      </div>
    </div>
  </div>
</template>
