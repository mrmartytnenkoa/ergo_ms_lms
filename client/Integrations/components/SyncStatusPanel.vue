<script setup>
import { computed } from 'vue'
import { Activity, CheckCircle, XCircle, AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
  integrations: {
    type: Array,
    default: () => []
  }
})

const connected = computed(() =>
  props.integrations.filter(i => i.status === 'connected').length
)

const disconnected = computed(() =>
  props.integrations.filter(i => i.status === 'disconnected').length
)

const errors = computed(() =>
  props.integrations.filter(i => i.status === 'error').length
)

const indicators = computed(() => [
  {
    label: 'Подключено',
    count: connected.value,
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success bg-opacity-10'
  },
  {
    label: 'Отключено',
    count: disconnected.value,
    icon: XCircle,
    color: 'text-secondary',
    bg: 'bg-secondary bg-opacity-10'
  },
  {
    label: 'Ошибки',
    count: errors.value,
    icon: AlertTriangle,
    color: 'text-danger',
    bg: 'bg-danger bg-opacity-10'
  }
])
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header bg-white d-flex align-items-center">
      <Activity :size="18" class="me-2 text-primary" />
      <h6 class="card-title mb-0">Статус синхронизации</h6>
    </div>
    <div class="card-body">
      <div class="row g-3">
        <div
          v-for="item in indicators"
          :key="item.label"
          class="col-4"
        >
          <div :class="['rounded-3 p-3 text-center', item.bg]">
            <component :is="item.icon" :size="22" :class="item.color" />
            <div :class="['fs-4 fw-bold mt-1', item.color]">
              {{ item.count }}
            </div>
            <div class="small text-muted">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
