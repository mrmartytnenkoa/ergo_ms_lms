<script setup>
import { Filter } from 'lucide-vue-next'

defineProps({
  fields: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="input-group">
    <span class="input-group-text">
      <Filter :size="16" />
    </span>
    <select
      class="form-select"
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option value="">Все направления</option>
      <option v-for="field in fields" :key="field" :value="field">{{ field }}</option>
    </select>
  </div>
</template>
