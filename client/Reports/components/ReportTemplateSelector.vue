<script setup>
import { FileBarChart, FileSpreadsheet, FileText } from 'lucide-vue-next'

const props = defineProps({
  templates: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

function select(id) {
  emit('update:modelValue', id)
}

function formatIcon(format) {
  const map = {
    pdf: FileText,
    xlsx: FileSpreadsheet,
    csv: FileBarChart
  }
  return map[format] || FileText
}

function formatBadgeClass(format) {
  const map = {
    pdf: 'bg-danger',
    xlsx: 'bg-success',
    csv: 'bg-info'
  }
  return map[format] || 'bg-secondary'
}
</script>

<template>
  <div class="row g-3">
    <div
      v-for="tmpl in templates"
      :key="tmpl.id"
      class="col-12 col-sm-6 col-lg-4"
    >
      <div
        class="card h-100 cursor-pointer transition-border"
        :class="modelValue === tmpl.id
          ? 'border-primary border-2 shadow'
          : 'border hover-shadow'"
        role="button"
        @click="select(tmpl.id)"
      >
        <div class="card-body">
          <div class="d-flex align-items-start justify-content-between mb-2">
            <component
              :is="formatIcon(tmpl.format)"
              :size="22"
              class="text-primary mt-1"
            />
            <span
              class="badge text-uppercase"
              :class="formatBadgeClass(tmpl.format)"
            >
              {{ tmpl.format }}
            </span>
          </div>
          <h6 class="card-title fw-semibold">{{ tmpl.name }}</h6>
          <p class="card-text text-muted small mb-0">{{ tmpl.description }}</p>
        </div>
      </div>
    </div>

    <div v-if="templates.length === 0" class="col-12 text-center text-muted py-4">
      Шаблоны отчётов не найдены
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.hover-shadow:hover {
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.08);
}
.transition-border {
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
</style>
