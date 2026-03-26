<script setup>
import { computed } from 'vue'
import { BookOpen, CheckCircle, Clock, Trophy } from 'lucide-vue-next'

const props = defineProps({
  summary: { type: Object, required: true }
})

const progressPercent = computed(() => {
  if (!props.summary.totalHours) return 0
  return Math.round((props.summary.completedHours / props.summary.totalHours) * 100)
})

function statusBadge(status) {
  return status === 'completed' ? 'bg-success' : 'bg-primary'
}

function statusLabel(status) {
  return status === 'completed' ? 'Завершён' : 'В процессе'
}

function gradeColor(grade) {
  if (grade >= 5) return 'text-success'
  if (grade >= 4) return 'text-primary'
  if (grade >= 3) return 'text-warning'
  return 'text-danger'
}
</script>

<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="card text-center h-100">
          <div class="card-body py-3">
            <BookOpen :size="24" class="text-primary mb-2" />
            <div class="h4 mb-0">{{ summary.totalCourses }}</div>
            <small class="text-muted">Всего курсов</small>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card text-center h-100">
          <div class="card-body py-3">
            <CheckCircle :size="24" class="text-success mb-2" />
            <div class="h4 mb-0">{{ summary.completedCourses }}</div>
            <small class="text-muted">Завершено</small>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card text-center h-100">
          <div class="card-body py-3">
            <Clock :size="24" class="text-warning mb-2" />
            <div class="h4 mb-0">{{ summary.completedHours }}/{{ summary.totalHours }}</div>
            <small class="text-muted">Часов пройдено</small>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="card text-center h-100">
          <div class="card-body py-3">
            <Trophy :size="24" class="text-info mb-2" />
            <div class="h4 mb-0">{{ summary.averageGrade }}</div>
            <small class="text-muted">Средний балл</small>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <div class="d-flex justify-content-between small mb-1">
        <span>Общий прогресс обучения</span>
        <span class="fw-medium">{{ progressPercent }}%</span>
      </div>
      <div class="progress" style="height: 8px;">
        <div class="progress-bar bg-primary" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header">
        <h6 class="mb-0">Предметы и курсы</h6>
      </div>
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Название</th>
              <th class="text-center" style="width: 100px;">Оценка</th>
              <th style="width: 180px;">Прогресс</th>
              <th class="text-center" style="width: 120px;">Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subj in summary.subjects" :key="subj.name">
              <td>{{ subj.name }}</td>
              <td class="text-center">
                <span v-if="subj.grade" class="fw-bold" :class="gradeColor(subj.grade)">{{ subj.grade }}</span>
                <span v-else class="text-muted">—</span>
              </td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="progress flex-grow-1" style="height: 6px;">
                    <div
                      class="progress-bar"
                      :class="subj.status === 'completed' ? 'bg-success' : 'bg-primary'"
                      :style="{ width: subj.progress + '%' }"
                    ></div>
                  </div>
                  <small class="text-muted" style="min-width: 35px;">{{ subj.progress }}%</small>
                </div>
              </td>
              <td class="text-center">
                <span class="badge" :class="statusBadge(subj.status)">{{ statusLabel(subj.status) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="summary.achievements?.length" class="card">
      <div class="card-header">
        <h6 class="mb-0">
          <Trophy :size="16" class="me-2 align-middle text-warning" />
          Достижения
        </h6>
      </div>
      <ul class="list-group list-group-flush">
        <li v-for="(a, idx) in summary.achievements" :key="idx" class="list-group-item d-flex justify-content-between align-items-center">
          <span>{{ a.title }}</span>
          <small class="text-muted">{{ new Date(a.date).toLocaleDateString('ru-RU') }}</small>
        </li>
      </ul>
    </div>
  </div>
</template>
