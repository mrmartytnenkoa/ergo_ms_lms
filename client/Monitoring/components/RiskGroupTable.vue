<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white">
      <h5 class="mb-0">Группы риска</h5>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Имя</th>
              <th>Группа</th>
              <th>Уровень неопределенности</th>
              <th>Последняя активность</th>
              <th>Уровень риска</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td class="fw-medium">{{ student.name }}</td>
              <td>{{ student.group }}</td>
              <td style="min-width: 160px;">
                <div class="d-flex align-items-center gap-2">
                  <div class="progress flex-grow-1" style="height: 8px;">
                    <div
                      class="progress-bar"
                      :class="uncertaintyBarClass(student.uncertaintyScore)"
                      :style="{ width: student.uncertaintyScore + '%' }"
                    />
                  </div>
                  <small class="text-muted">{{ student.uncertaintyScore }}%</small>
                </div>
              </td>
              <td>{{ formatDate(student.lastActivity) }}</td>
              <td>
                <span class="badge" :class="riskBadgeClass(student.riskLevel)">
                  {{ riskLabel(student.riskLevel) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  students: {
    type: Array,
    required: true
  }
})

function uncertaintyBarClass(score) {
  if (score >= 80) return 'bg-danger'
  if (score >= 60) return 'bg-warning'
  return 'bg-success'
}

const riskMap = {
  high: { label: 'Высокий', class: 'bg-danger' },
  medium: { label: 'Средний', class: 'bg-warning text-dark' },
  low: { label: 'Низкий', class: 'bg-success' }
}

function riskBadgeClass(level) {
  return riskMap[level]?.class || 'bg-secondary'
}

function riskLabel(level) {
  return riskMap[level]?.label || level
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>
