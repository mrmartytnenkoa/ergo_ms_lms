<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  current: { type: Number, required: true },
  target: { type: Number, required: true },
  max: { type: Number, default: 5 }
})

const currentPercent = computed(() => (props.current / props.max) * 100)
const targetPercent = computed(() => (props.target / props.max) * 100)

const barVariant = computed(() => {
  const ratio = props.current / props.target
  if (ratio >= 1) return 'bg-success'
  if (ratio >= 0.6) return 'bg-primary'
  return 'bg-warning'
})
</script>

<template>
  <div class="mb-3">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <span class="small fw-medium">{{ name }}</span>
      <span class="small text-muted">{{ current }} / {{ max }}</span>
    </div>
    <div class="position-relative">
      <div class="progress" style="height: 8px;">
        <div class="progress-bar" :class="barVariant" :style="{ width: currentPercent + '%' }"></div>
      </div>
      <div
        class="skill-progress__target"
        :style="{ left: targetPercent + '%' }"
        :title="'Цель: ' + target"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.skill-progress__target {
  position: absolute;
  top: -2px;
  width: 2px;
  height: 12px;
  background: #dc3545;
  transform: translateX(-50%);
  border-radius: 1px;
}
</style>
