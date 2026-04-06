<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  BarChart, TrendingUp, Award, BookOpen, FileCheck,
  Download, Search, MessageSquare,
  ClipboardCheck, PenLine, GraduationCap
} from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import { lmsApi } from '../js/lmsApi'
import RoleGuard from '../components/RoleGuard.vue'
import { globalUserRole } from '../composables/useUserRole'
import './grades.scss'

const grades = ref([])
const loading = ref(true)
const activeTab = ref('all')
const searchQuery = ref('')
const expandedCourses = ref({})

const tabs = [
  { key: 'all', label: 'Все' },
  { key: 'test', label: 'Тесты' },
  { key: 'assignment', label: 'Задания' },
  { key: 'manual', label: 'Ручные' }
]

const statItems = [
  { key: 'average', label: 'Средний балл', icon: TrendingUp, color: 'primary' },
  { key: 'total', label: 'Всего оценок', icon: BookOpen, color: 'info' },
  { key: 'excellent', label: 'Отличных', icon: Award, color: 'success' },
  { key: 'courses', label: 'Курсов', icon: GraduationCap, color: 'warning' }
]

const stats = computed(() => {
  const all = grades.value
  if (all.length === 0) return { average: 0, total: 0, excellent: 0, courses: 0 }
  const sum = all.reduce((acc, g) => acc + g.grade, 0)
  return {
    average: (sum / all.length).toFixed(1),
    total: all.length,
    excellent: all.filter(g => g.grade >= 90).length,
    courses: [...new Set(all.map(g => g.subject_name))].length
  }
})

function tabCount(key) {
  if (key === 'all') return grades.value.length
  return grades.value.filter(g => g.grade_type === key).length
}

const filteredGrades = computed(() => {
  let result = grades.value
  if (activeTab.value !== 'all') {
    result = result.filter(g => g.grade_type === activeTab.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(g =>
      g.subject_name?.toLowerCase().includes(q) ||
      g.assignment_name?.toLowerCase().includes(q) ||
      g.grader_name?.toLowerCase().includes(q)
    )
  }
  return result.sort((a, b) => new Date(b.related) - new Date(a.related))
})

const groupedByCourse = computed(() => {
  const map = {}
  filteredGrades.value.forEach(g => {
    if (!map[g.subject_name]) map[g.subject_name] = []
    map[g.subject_name].push(g)
  })
  return Object.entries(map)
    .map(([name, items]) => {
      const avg = items.reduce((s, g) => s + g.grade, 0) / items.length
      return { name, items, average: avg, count: items.length }
    })
    .sort((a, b) => b.average - a.average)
})

const gradeRanges = [
  { min: 90, key: 'success', hex: '#198754' },
  { min: 70, key: 'primary', hex: '#0d6efd' },
  { min: 50, key: 'warning', hex: '#ffc107' },
  { min: -Infinity, key: 'danger', hex: '#dc3545' },
]

function getGradeRange(grade) {
  return gradeRanges.find(range => grade >= range.min) || gradeRanges[gradeRanges.length - 1]
}

const donutOptions = computed(() => ({
  chart: { type: 'donut', height: 260 },
  labels: ['Отлично (90+)', 'Хорошо (70-89)', 'Удовл. (50-69)', 'Не зачтено (<50)'],
  colors: gradeRanges.map(range => range.hex),
  legend: { position: 'bottom', fontSize: '13px' },
  plotOptions: { pie: { donut: { size: '58%' } } },
  dataLabels: { enabled: true, formatter: (val) => val.toFixed(0) + '%' }
}))

const donutSeries = computed(() => {
  const all = grades.value
  return [
    all.filter(g => g.grade >= 90).length,
    all.filter(g => g.grade >= 70 && g.grade < 90).length,
    all.filter(g => g.grade >= 50 && g.grade < 70).length,
    all.filter(g => g.grade < 50).length
  ]
})

const trendOptions = computed(() => ({
  chart: { type: 'area', height: 260, toolbar: { show: false }, zoom: { enabled: false } },
  stroke: { curve: 'smooth', width: 2.5 },
  colors: ['#0d6efd'],
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 } },
  xaxis: { categories: trendData.value.labels },
  yaxis: { min: 0, max: 100, labels: { formatter: (v) => v.toFixed(0) } },
  dataLabels: { enabled: false },
  tooltip: { y: { formatter: (v) => v.toFixed(1) + ' баллов' } },
  grid: { borderColor: '#f1f1f1' }
}))

const trendData = computed(() => {
  const all = grades.value
  if (all.length === 0) return { labels: [], values: [] }

  const byMonth = {}
  all.forEach(g => {
    const d = new Date(g.related)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(g.grade)
  })

  const sorted = Object.keys(byMonth).sort()
  const monthNames = { '01': 'Янв', '02': 'Фев', '03': 'Мар', '04': 'Апр', '05': 'Май', '06': 'Июн',
    '07': 'Июл', '08': 'Авг', '09': 'Сен', '10': 'Окт', '11': 'Ноя', '12': 'Дек' }

  const labels = sorted.map(k => monthNames[k.split('-')[1]] || k)
  const values = sorted.map(k => {
    const arr = byMonth[k]
    return arr.reduce((s, v) => s + v, 0) / arr.length
  })

  return { labels, values }
})

const trendSeries = computed(() => [{ name: 'Средний балл', data: trendData.value.values }])

function toggleCourse(name) {
  expandedCourses.value[name] = !expandedCourses.value[name]
}

function isCourseExpanded(name) {
  return expandedCourses.value[name] !== false
}

function getGradeColor(grade) {
  return getGradeRange(grade).key
}

function getGradeBg(grade) {
  const color = getGradeColor(grade)
  return `bg-${color}-subtle text-${color}`
}

function getGradeHex(grade) {
  return getGradeRange(grade).hex
}

function getGradeSubtleBg(grade) {
  const hex = getGradeHex(grade).replace('#', '')
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, 0.14)`
}

function getTypeIcon(type) {
  switch (type) {
    case 'test': return ClipboardCheck
    case 'assignment': return FileCheck
    default: return PenLine
  }
}

function getTypeName(type) {
  switch (type) {
    case 'test': return 'Тест'
    case 'assignment': return 'Задание'
    case 'manual': return 'Ручная'
    default: return 'Оценка'
  }
}

function getTypeBadgeClass(type) {
  switch (type) {
    case 'test': return 'bg-info-subtle text-info'
    case 'assignment': return 'bg-success-subtle text-success'
    default: return 'bg-secondary-subtle text-secondary'
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ru', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function exportGrades() {
  const data = filteredGrades.value.map(g => ({
    'Курс': g.subject_name,
    'Задание': g.assignment_name || '-',
    'Оценка': g.grade,
    'Дата': formatDate(g.related),
    'Тип': getTypeName(g.grade_type),
    'Преподаватель': g.grader_name || '-',
    'Комментарий': g.feedback || '-'
  }))
  if (!data.length) return
  const headers = Object.keys(data[0])
  const csv = [headers.join(','), ...data.map(r => headers.map(h => `"${r[h]}"`).join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'my_grades.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

async function loadGrades() {
  try {
    loading.value = true
    const response = await lmsApi.getMyGrades()
    grades.value = response.data || []
    const names = [...new Set(grades.value.map(g => g.subject_name))]
    names.forEach(n => { expandedCourses.value[n] = true })
  } catch (error) {
    console.error('Ошибка загрузки оценок:', error)
    grades.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  globalUserRole.loadUserRoles().then(() => loadGrades())
})
</script>

<template>
  <RoleGuard
    :roles="['student', 'admin', 'teacher']"
    fallback-message="Раздел оценок доступен только студентам, преподавателям и администраторам"
  >
    <div class="grades-view">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 class="mb-1 d-flex align-items-center">
            <BarChart :size="26" class="me-2 text-primary" style="vertical-align: middle" />
            Мои оценки
          </h3>
          <p class="text-muted mb-0 small">Просмотр оценок и статистики по курсам</p>
        </div>
        <button
          class="btn btn-outline-primary btn-sm"
          :disabled="loading || filteredGrades.length === 0"
          @click="exportGrades"
        >
          <Download :size="15" class="me-1" style="vertical-align: middle" />
          Экспорт CSV
        </button>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
        <p class="mt-3 text-muted">Загрузка оценок...</p>
      </div>

      <template v-else-if="grades.length > 0">
        <!-- Stat Cards -->
        <div class="row mb-4 g-3">
          <div v-for="item in statItems" :key="item.key" class="col-xl-3 col-sm-6">
            <div class="card stat-card border-0 shadow-sm h-100">
              <div class="card-body d-flex align-items-center gap-3 py-3">
                <div :class="`stat-icon-wrapper bg-${item.color}-subtle text-${item.color}`">
                  <component :is="item.icon" :size="20" />
                </div>
                <div>
                  <div class="stat-label text-muted mb-1">{{ item.label }}</div>
                  <div class="stat-value">{{ stats[item.key] }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="row mb-4 g-3">
          <div class="col-lg-5">
            <div class="card chart-container shadow-sm h-100">
              <div class="card-body">
                <h6 class="mb-3 fw-semibold">Распределение оценок</h6>
                <VueApexCharts type="donut" :options="donutOptions" :series="donutSeries" height="260" />
              </div>
            </div>
          </div>
          <div class="col-lg-7">
            <div class="card chart-container shadow-sm h-100">
              <div class="card-body">
                <h6 class="mb-3 fw-semibold">Динамика среднего балла</h6>
                <VueApexCharts type="area" :options="trendOptions" :series="trendSeries" height="260" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs + Search -->
        <div class="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-3 border-bottom">
          <ul class="nav filter-tabs mb-0">
            <li v-for="tab in tabs" :key="tab.key" class="nav-item">
              <button
                class="nav-link"
                :class="{ active: activeTab === tab.key }"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
                <span class="badge bg-secondary-subtle text-secondary ms-1">{{ tabCount(tab.key) }}</span>
              </button>
            </li>
          </ul>
          <div class="input-group input-group-sm search-input mb-2">
            <span class="input-group-text border-end-0"><Search :size="14" /></span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control border-start-0"
              placeholder="Поиск по названию..."
            />
          </div>
        </div>

        <!-- Grouped by course -->
        <div v-if="groupedByCourse.length > 0" class="grade-accordion">
          <div
            v-for="group in groupedByCourse"
            :key="group.name"
            class="accordion-item"
          >
            <button
              class="accordion-button"
              :class="{ collapsed: !isCourseExpanded(group.name) }"
              @click="toggleCourse(group.name)"
            >
              <div class="d-flex align-items-center justify-content-between w-100 me-2">
                <div class="d-flex align-items-center gap-2">
                  <GraduationCap :size="18" class="text-muted" style="vertical-align: middle" />
                  <span>{{ group.name }}</span>
                  <span class="text-muted small">({{ group.count }})</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <div class="progress" style="width: 80px; height: 6px">
                    <div
                      class="progress-bar"
                      :style="{ width: group.average + '%', backgroundColor: getGradeHex(group.average) }"
                    ></div>
                  </div>
                  <span
                    class="course-avg-badge"
                    :style="{ color: getGradeHex(group.average), backgroundColor: getGradeSubtleBg(group.average) }"
                  >
                    {{ group.average.toFixed(1) }}
                  </span>
                </div>
              </div>
            </button>
            <div v-show="isCourseExpanded(group.name)" class="accordion-body">
              <div
                v-for="g in group.items"
                :key="g.id"
                class="grade-item"
              >
                <div :class="`grade-score ${getGradeBg(g.grade)}`">
                  {{ g.grade }}
                </div>
                <div class="flex-grow-1 min-w-0">
                  <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <span class="fw-semibold text-truncate" style="max-width: 300px">
                      {{ g.assignment_name || 'Оценка' }}
                    </span>
                    <span :class="`grade-type-badge ${getTypeBadgeClass(g.grade_type)}`">
                      <component :is="getTypeIcon(g.grade_type)" :size="11" class="me-1" style="vertical-align: middle" />
                      {{ getTypeName(g.grade_type) }}
                    </span>
                  </div>
                  <div class="d-flex align-items-center gap-3 text-muted small">
                    <span>{{ formatDate(g.related) }}</span>
                    <span v-if="g.grader_name">{{ g.grader_name }}</span>
                  </div>
                  <div v-if="g.feedback" class="grade-feedback">
                    <MessageSquare :size="12" class="me-1" style="vertical-align: middle" />
                    {{ g.feedback }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty filtered -->
        <div v-else class="empty-state text-center">
          <div class="empty-icon bg-light">
            <Search :size="32" class="text-muted" />
          </div>
          <h6 class="text-muted">Оценки не найдены</h6>
          <p class="text-muted small">Попробуйте изменить фильтры или поисковый запрос</p>
        </div>
      </template>

      <!-- No grades at all -->
      <div v-else class="empty-state text-center">
        <div class="empty-icon bg-primary-subtle">
          <Award :size="36" class="text-primary" />
        </div>
        <h5 class="text-muted">Оценок пока нет</h5>
        <p class="text-muted">Оценки появятся после проверки ваших работ и тестов преподавателями</p>
      </div>
    </div>
  </RoleGuard>
</template>
