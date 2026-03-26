<script setup>
import { computed } from 'vue'
import { X, Check, User } from 'lucide-vue-next'

const props = defineProps({
  student: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

function statusLabel(status) {
  const map = {
    active: 'Активный',
    inactive: 'Неактивный',
    graduated: 'Выпускник'
  }
  return map[status] || status
}

function statusClass(status) {
  const map = {
    active: 'bg-success',
    inactive: 'bg-secondary',
    graduated: 'bg-info'
  }
  return map[status] || 'bg-secondary'
}

const fields = computed(() => {
  if (!props.student) return []
  return [
    { label: 'Email', value: props.student.email || '-' },
    { label: 'Группа', value: props.student.group || '-' },
    { label: 'Курс', value: props.student.course || '-' },
    { label: 'Дата зачисления', value: props.student.enrollmentDate || '-' }
  ]
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show && student" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-dialog modal-dialog-centered" style="max-width: 520px">
        <div class="modal-content shadow-lg">
          <div class="modal-header">
            <div class="d-flex align-items-center">
              <User :size="20" class="me-2 text-primary" />
              <h5 class="modal-title mb-0">Информация о студенте</h5>
            </div>
            <button class="btn-close" @click="emit('close')" />
          </div>

          <div class="modal-body">
            <h5 class="fw-semibold mb-1">
              {{ student.lastName }} {{ student.firstName }}
            </h5>
            <span class="badge mb-3" :class="statusClass(student.status)">
              {{ statusLabel(student.status) }}
            </span>

            <div class="mt-3">
              <div
                v-for="field in fields"
                :key="field.label"
                class="d-flex justify-content-between py-2 border-bottom"
              >
                <span class="text-muted">{{ field.label }}</span>
                <span class="fw-medium">{{ field.value }}</span>
              </div>

              <div class="d-flex justify-content-between py-2 border-bottom">
                <span class="text-muted">Диагностика</span>
                <span>
                  <Check v-if="student.hasDiagnostics" :size="18" class="text-success" />
                  <X v-else :size="18" class="text-danger" />
                  {{ student.hasDiagnostics ? 'Пройдена' : 'Не пройдена' }}
                </span>
              </div>

              <div class="d-flex justify-content-between py-2">
                <span class="text-muted">Траектория</span>
                <span>
                  <Check v-if="student.hasTrajectory" :size="18" class="text-success" />
                  <X v-else :size="18" class="text-danger" />
                  {{ student.hasTrajectory ? 'Назначена' : 'Не назначена' }}
                </span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="emit('close')">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
</style>
