<template>
  <div class="d-flex flex-wrap gap-2">
    <button
      v-for="filter in filters"
      :key="filter.value"
      class="btn btn-sm"
      :class="modelValue === filter.value ? 'btn-primary' : 'btn-outline-secondary'"
      @click="emit('update:modelValue', filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['update:modelValue'])

const filters = [
  { value: 'all', label: 'Все' },
  { value: 'masterclass', label: 'Мастер-классы' },
  { value: 'excursion', label: 'Экскурсии' },
  { value: 'fair', label: 'Ярмарки' },
  { value: 'lecture', label: 'Лекции' },
  { value: 'workshop', label: 'Воркшопы' }
]
</script>
