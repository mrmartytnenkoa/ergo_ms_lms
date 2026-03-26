<script setup>
import { computed } from 'vue'
import { RefreshCw, Database, Globe, Cloud, Server } from 'lucide-vue-next'

const props = defineProps({
  integration: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'sync'])

const typeIcon = computed(() => {
  const map = {
    database: Database,
    api: Globe,
    cloud: Cloud,
    server: Server
  }
  return map[props.integration.type] || Globe
})

function statusBadge(status) {
  const map = {
    connected: { class: 'bg-success', label: 'Подключено' },
    disconnected: { class: 'bg-secondary', label: 'Отключено' },
    error: { class: 'bg-danger', label: 'Ошибка' }
  }
  return map[status] || { class: 'bg-secondary', label: status }
}
</script>

<template>
  <div
    class="card h-100 border hover-shadow cursor-pointer"
    @click="emit('click')"
  >
    <div class="card-body">
      <div class="d-flex align-items-start justify-content-between mb-2">
        <div class="d-flex align-items-center">
          <component
            :is="typeIcon"
            :size="20"
            class="text-primary me-2"
          />
          <h6 class="mb-0 fw-semibold">{{ integration.name }}</h6>
        </div>
        <span
          class="badge"
          :class="statusBadge(integration.status).class"
        >
          {{ statusBadge(integration.status).label }}
        </span>
      </div>

      <p class="text-muted small mb-2">{{ integration.description }}</p>

      <div class="d-flex align-items-center justify-content-between">
        <small class="text-muted">
          Синхр.: {{ integration.lastSync || 'нет данных' }}
        </small>
        <button
          class="btn btn-sm btn-outline-primary"
          @click.stop="emit('sync')"
        >
          <RefreshCw :size="14" class="me-1" />
          Синхр.
        </button>
      </div>
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
</style>
