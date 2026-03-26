<script setup>
import { Check, X } from 'lucide-vue-next'

defineProps({
  students: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

function statusBadge(status) {
  const map = {
    active: { class: 'bg-success', label: 'Активный' },
    inactive: { class: 'bg-secondary', label: 'Неактивный' },
    graduated: { class: 'bg-info', label: 'Выпускник' }
  }
  return map[status] || { class: 'bg-secondary', label: status }
}
</script>

<template>
  <div>
    <div v-if="students.length === 0" class="text-center text-muted py-4">
      Студенты не найдены
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>ФИО</th>
            <th>Группа</th>
            <th>Курс</th>
            <th class="text-center">Статус</th>
            <th class="text-center">Диагностика</th>
            <th class="text-center">Траектория</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in students"
            :key="student.id"
            class="cursor-pointer"
            @click="emit('select', student)"
          >
            <td class="fw-medium">
              {{ student.lastName }} {{ student.firstName }}
            </td>
            <td>{{ student.group }}</td>
            <td>{{ student.course }}</td>
            <td class="text-center">
              <span class="badge" :class="statusBadge(student.status).class">
                {{ statusBadge(student.status).label }}
              </span>
            </td>
            <td class="text-center">
              <Check v-if="student.hasDiagnostics" :size="18" class="text-success" />
              <X v-else :size="18" class="text-danger" />
            </td>
            <td class="text-center">
              <Check v-if="student.hasTrajectory" :size="18" class="text-success" />
              <X v-else :size="18" class="text-danger" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
