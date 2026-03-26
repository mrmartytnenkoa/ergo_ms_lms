<script setup>
import { ref, computed } from 'vue'
import { Filter } from 'lucide-vue-next'

const props = defineProps({
  template: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['apply'])

const dateFrom = ref('')
const dateTo = ref('')
const selectedFormat = ref(props.template?.format || '')
const selectedSections = ref([...(props.template?.sections || [])])

const formats = computed(() => {
  if (!props.template?.formats) return [props.template?.format].filter(Boolean)
  return props.template.formats
})

const sections = computed(() => props.template?.sections || [])

function toggleSection(section) {
  const idx = selectedSections.value.indexOf(section)
  if (idx >= 0) {
    selectedSections.value.splice(idx, 1)
  } else {
    selectedSections.value.push(section)
  }
}

function apply() {
  emit('apply', {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    format: selectedFormat.value,
    sections: [...selectedSections.value]
  })
}
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header bg-white d-flex align-items-center">
      <Filter :size="18" class="me-2 text-primary" />
      <h5 class="card-title mb-0">Параметры отчёта</h5>
    </div>
    <div class="card-body">
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <label class="form-label">Дата начала</label>
          <input v-model="dateFrom" type="date" class="form-control" />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label">Дата окончания</label>
          <input v-model="dateTo" type="date" class="form-control" />
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label">Формат</label>
          <select v-model="selectedFormat" class="form-select">
            <option v-for="fmt in formats" :key="fmt" :value="fmt">
              {{ fmt?.toUpperCase() }}
            </option>
          </select>
        </div>

        <div v-if="sections.length" class="col-12">
          <label class="form-label">Разделы отчёта</label>
          <div class="d-flex flex-wrap gap-2">
            <div v-for="section in sections" :key="section" class="form-check">
              <input
                :id="'section-' + section"
                type="checkbox"
                class="form-check-input"
                :checked="selectedSections.includes(section)"
                @change="toggleSection(section)"
              />
              <label :for="'section-' + section" class="form-check-label">
                {{ section }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="text-end mt-4">
        <button class="btn btn-primary" @click="apply">
          Сформировать отчёт
        </button>
      </div>
    </div>
  </div>
</template>
