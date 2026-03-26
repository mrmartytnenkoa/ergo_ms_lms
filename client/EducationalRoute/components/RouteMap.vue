<script setup>
import { computed } from 'vue'

const props = defineProps({
  stages: { type: Array, required: true }
})

function dotClass(stage) {
  if (stage.status === 'completed') return 'route-map__dot--completed'
  if (stage.status === 'current') return 'route-map__dot--current'
  return 'route-map__dot--upcoming'
}
</script>

<template>
  <div class="card">
    <div class="card-body py-3">
      <div class="route-map d-none d-md-flex align-items-center justify-content-between position-relative">
        <div class="route-map__line"></div>
        <div
          v-for="stage in stages"
          :key="stage.id"
          class="route-map__node text-center position-relative"
        >
          <div class="route-map__dot" :class="dotClass(stage)"></div>
          <small class="route-map__label d-block mt-2 text-muted">{{ stage.name }}</small>
        </div>
      </div>

      <div class="d-md-none">
        <div
          v-for="(stage, idx) in stages"
          :key="stage.id"
          class="d-flex align-items-center mb-2"
          :class="{ 'mb-0': idx === stages.length - 1 }"
        >
          <div class="route-map__dot flex-shrink-0" :class="dotClass(stage)"></div>
          <small class="ms-2" :class="stage.status === 'current' ? 'fw-semibold' : 'text-muted'">
            {{ stage.name }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.route-map {
  padding: 0 16px;
}

.route-map__line {
  position: absolute;
  top: 50%;
  left: 24px;
  right: 24px;
  height: 2px;
  background: #dee2e6;
  transform: translateY(-12px);
  z-index: 0;
}

.route-map__node {
  z-index: 1;
  flex: 1;
  max-width: 120px;
}

.route-map__dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin: 0 auto;
  border: 3px solid #dee2e6;
  background: #fff;
  transition: all 0.3s ease;
}

.route-map__dot--completed {
  background: #198754;
  border-color: #198754;
}

.route-map__dot--current {
  background: #0d6efd;
  border-color: #0d6efd;
  animation: pulse 2s infinite;
}

.route-map__dot--upcoming {
  background: #fff;
  border-color: #adb5bd;
}

.route-map__label {
  font-size: 0.75rem;
  line-height: 1.2;
  word-wrap: break-word;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(13, 110, 253, 0); }
}
</style>
