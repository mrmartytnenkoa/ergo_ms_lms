<script setup>
import { computed } from 'vue'
import { Search } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ search: '', status: '' })
  }
})

const emit = defineEmits(['update:modelValue'])

const filters = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function updateField(field, value) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const statuses = [
  { value: '', label: 'Все' },
  { value: 'active', label: 'Активные' },
  { value: 'inactive', label: 'Неактивные' },
  { value: 'graduated', label: 'Выпускники' }
]
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <div class="row g-3 align-items-end">
        <div class="col-12 col-md-6">
          <label class="form-label">Поиск</label>
          <div class="input-group">
            <span class="input-group-text">
              <Search :size="16" />
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="ФИО или группа..."
              :value="filters.search"
              @input="updateField('search', $event.target.value)"
            />
          </div>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Статус</label>
          <select
            class="form-select"
            :value="filters.status"
            @change="updateField('status', $event.target.value)"
          >
            <option v-for="s in statuses" :key="s.value" :value="s.value">
              {{ s.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
