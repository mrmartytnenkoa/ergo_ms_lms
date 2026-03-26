<script setup>
import { computed } from 'vue'
import { CheckCircle2, Clock, Circle, Calendar } from 'lucide-vue-next'

const props = defineProps({
  plan: { type: Object, required: true }
})

const steps = computed(() => props.plan.steps || [])

const statusConfig = {
  completed: { label: 'Выполнено', badge: 'bg-success', icon: CheckCircle2 },
  in_progress: { label: 'В процессе', badge: 'bg-primary', icon: Clock },
  pending: { label: 'Ожидает', badge: 'bg-secondary', icon: Circle }
}

function getStatusConfig(status) {
  return statusConfig[status] || statusConfig.pending
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="card">
    <div class="card-body p-0">
      <div v-if="steps.length === 0" class="text-muted text-center py-4">
        В плане пока нет шагов
      </div>

      <div v-else class="list-group list-group-flush">
        <div
          v-for="(step, idx) in steps"
          :key="step.id"
          class="list-group-item"
        >
          <div class="d-flex">
            <div class="d-flex flex-column align-items-center me-3" style="width: 20px;">
              <div
                class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                :class="step.status === 'completed' ? 'bg-success' : step.status === 'in_progress' ? 'bg-primary' : 'bg-secondary'"
                style="width: 20px; height: 20px;"
              >
                <component :is="getStatusConfig(step.status).icon" :size="12" class="text-white" />
              </div>
              <div
                v-if="idx < steps.length - 1"
                class="flex-grow-1 mt-1"
                :class="step.status === 'completed' ? 'bg-success' : 'bg-light'"
                style="width: 2px; min-height: 16px;"
              ></div>
            </div>

            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start mb-1">
                <h6 class="mb-0" :class="{ 'text-decoration-line-through text-muted': step.status === 'completed' }">
                  {{ step.title }}
                </h6>
                <span class="badge ms-2 flex-shrink-0" :class="getStatusConfig(step.status).badge">
                  {{ getStatusConfig(step.status).label }}
                </span>
              </div>
              <p class="text-muted small mb-1">{{ step.description }}</p>
              <div class="d-flex align-items-center text-muted small">
                <Calendar :size="12" class="me-1 flex-shrink-0" />
                <span>Срок: {{ formatDate(step.deadline) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
