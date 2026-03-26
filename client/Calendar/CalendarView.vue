<template>
  <div class="calendar-view container-fluid px-4 py-3">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="h3 mb-1 text-gray-800">
          <Calendar :size="28" class="me-2 text-primary" />
          Календарь событий
        </h1>
        <p class="text-muted mb-0">Отслеживайте важные события и сроки</p>
      </div>
    </div>

    <!-- Stat-карточки -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3" v-for="stat in stats" :key="stat.label">
        <div class="stat-card card border-0 shadow-sm h-100">
          <div class="card-body d-flex align-items-center gap-3 py-3 px-3">
            <div class="stat-icon-wrapper" :class="`bg-${stat.variant} bg-opacity-10`">
              <component :is="stat.icon" :size="20" :class="`text-${stat.variant}`" />
            </div>
            <div>
              <div class="stat-label text-muted">{{ stat.label }}</div>
              <div class="stat-value">{{ stat.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter-tabs -->
    <ul class="nav filter-tabs border-bottom mb-4">
      <li class="nav-item" v-for="tab in eventTabs" :key="tab.value">
        <button
          class="nav-link"
          :class="{ active: selectedEventType === tab.value }"
          @click="selectedEventType = tab.value"
        >
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            class="badge ms-1"
            :class="`bg-${tab.color} bg-opacity-10 text-${tab.color}`"
          >{{ tab.count }}</span>
        </button>
      </li>
    </ul>

    <!-- Загрузка -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Загрузка...</span></div>
      <p class="mt-3 text-muted">Загрузка событий...</p>
    </div>

    <template v-else>
      <div class="row g-4">
        <!-- Левая колонка: навигация + сетка + события дня -->
        <div class="col-lg-8">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex align-items-center gap-2">
              <button @click="navigateMonth(-1)" class="btn btn-outline-secondary btn-sm">
                <ChevronLeft :size="16" />
              </button>
              <h5 class="mb-0 mx-2">{{ currentPeriodText }}</h5>
              <button @click="navigateMonth(1)" class="btn btn-outline-secondary btn-sm">
                <ChevronRight :size="16" />
              </button>
              <button @click="goToToday" class="btn btn-outline-primary btn-sm ms-2">Сегодня</button>
            </div>
          </div>

          <CalendarGrid
            :currentDate="currentDate"
            :events="filteredEvents"
            :selectedDate="selectedDate"
            @select-date="onSelectDate"
          />

          <!-- События выбранного дня -->
          <div class="mt-4" v-if="selectedDayEvents.length > 0">
            <h6 class="text-muted mb-3">
              <Clock :size="16" class="me-1" />
              {{ selectedDateText }}
              <span class="badge bg-primary bg-opacity-10 text-primary ms-1">{{ selectedDayEvents.length }}</span>
            </h6>
            <div class="day-events-list">
              <div
                v-for="event in selectedDayEvents"
                :key="event.id"
                class="day-event-card"
                :class="`border-${event.color || 'primary'}`"
              >
                <div class="d-flex align-items-start justify-content-between">
                  <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <span class="badge" :class="`bg-${event.color || 'primary'}`">{{ getTypeLabel(event.event_type) }}</span>
                      <strong>{{ event.title }}</strong>
                    </div>
                    <p class="text-muted small mb-1">{{ event.description }}</p>
                    <div class="d-flex align-items-center gap-3">
                      <small class="text-muted" v-if="event.subject">
                        <BookOpen :size="12" class="me-1" />{{ event.subject.name }}
                      </small>
                      <small class="text-muted" v-if="event.location">
                        <MapPin :size="12" class="me-1" />{{ event.location }}
                      </small>
                    </div>
                  </div>
                  <div class="text-end text-nowrap ms-3">
                    <small class="text-muted d-block">
                      <Clock :size="12" class="me-1" />{{ formatTime(event) }}
                    </small>
                    <small v-if="getDuration(event)" class="text-muted">{{ getDuration(event) }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="selectedDate" class="empty-state mt-4">
            <Calendar :size="36" class="mb-2 opacity-50" />
            <p class="mb-0">Нет событий на {{ selectedDateText }}</p>
          </div>
        </div>

        <!-- Правая колонка: предстоящие события -->
        <div class="col-lg-4">
          <h6 class="text-muted mb-3">
            <AlertCircle :size="16" class="me-1" />
            Предстоящие события
          </h6>

          <div v-if="upcomingEvents.length === 0" class="empty-state">
            <Calendar :size="32" class="mb-2 opacity-50" />
            <p class="small mb-0">Нет предстоящих событий</p>
          </div>

          <div v-else>
            <div
              v-for="event in upcomingEvents"
              :key="event.id"
              class="upcoming-card"
              :class="`upcoming-card--${event.color || 'primary'}`"
              @click="onSelectDate(new Date(event.start_date))"
              style="cursor: pointer;"
            >
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="badge badge-sm" :class="`bg-${event.color || 'primary'}`" style="font-size: 0.65rem;">
                  {{ getTypeLabel(event.event_type) }}
                </span>
                <small class="text-muted">{{ formatShortDate(event.start_date) }}</small>
              </div>
              <div class="fw-semibold small">{{ event.title }}</div>
              <div class="d-flex align-items-center gap-2 mt-1">
                <small v-if="event.subject" class="text-muted">{{ event.subject.name }}</small>
                <small class="text-muted">
                  <Clock :size="10" class="me-1" />{{ formatTime(event) }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Calendar, Clock, MapPin, AlertCircle, BookOpen, ChevronLeft, ChevronRight, FileCheck } from 'lucide-vue-next'
import { lmsApi } from '../js/lmsApi'
import CalendarGrid from './CalendarGrid.vue'
import './calendar.scss'

const events = ref([])
const loading = ref(true)
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const selectedEventType = ref('all')

const typeLabels = {
  assignment: 'Задание', quiz: 'Тест', lesson: 'Урок', exam: 'Экзамен',
  deadline: 'Дедлайн', webinar: 'Вебинар', meeting: 'Совещание', other: 'Другое'
}

const typeColors = {
  assignment: 'primary', quiz: 'info', lesson: 'success', exam: 'danger',
  deadline: 'warning', webinar: 'info', meeting: 'secondary', other: 'secondary'
}

function getTypeLabel(type) {
  return typeLabels[type] || 'Событие'
}

const filteredEvents = computed(() => {
  if (selectedEventType.value === 'all') return events.value
  return events.value.filter(e => e.event_type === selectedEventType.value)
})

const eventTabs = computed(() => {
  const all = events.value
  const tabs = [{ value: 'all', label: 'Все', color: 'primary', count: all.length }]
  const types = ['assignment', 'quiz', 'lesson', 'exam', 'deadline', 'webinar', 'meeting']
  types.forEach(t => {
    const count = all.filter(e => e.event_type === t).length
    if (count > 0) {
      tabs.push({ value: t, label: typeLabels[t], color: typeColors[t], count })
    }
  })
  return tabs
})

const stats = computed(() => {
  const now = new Date()
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const monthEvents = events.value.filter(e => {
    const d = new Date(e.start_date)
    return d.getFullYear() === year && d.getMonth() === month
  })
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const deadlines = events.value.filter(e =>
    (e.event_type === 'deadline' || e.event_type === 'assignment') &&
    new Date(e.start_date) >= now && new Date(e.start_date) <= weekFromNow
  )
  const tests = events.value.filter(e =>
    (e.event_type === 'quiz' || e.event_type === 'exam') &&
    new Date(e.start_date) >= now && new Date(e.start_date) <= weekFromNow
  )
  const subjects = new Set(events.value.filter(e => e.subject).map(e => e.subject.name))

  return [
    { label: 'Событий в месяце', value: monthEvents.length, icon: Calendar, variant: 'primary' },
    { label: 'Дедлайнов (7 дн.)', value: deadlines.length, icon: AlertCircle, variant: 'danger' },
    { label: 'Тестов (7 дн.)', value: tests.length, icon: FileCheck, variant: 'info' },
    { label: 'Курсов', value: subjects.size, icon: BookOpen, variant: 'success' }
  ]
})

const selectedDayEvents = computed(() => {
  if (!selectedDate.value) return []
  const key = toDateKey(selectedDate.value)
  return filteredEvents.value
    .filter(e => toDateKey(new Date(e.start_date)) === key)
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
})

const upcomingEvents = computed(() => {
  const now = new Date()
  return filteredEvents.value
    .filter(e => new Date(e.start_date) >= now)
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .slice(0, 8)
})

const currentPeriodText = computed(() => {
  return currentDate.value.toLocaleDateString('ru', { year: 'numeric', month: 'long' })
})

const selectedDateText = computed(() => {
  if (!selectedDate.value) return ''
  return selectedDate.value.toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long' })
})

function toDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function navigateMonth(dir) {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + dir)
  currentDate.value = d
}

function goToToday() {
  currentDate.value = new Date()
  selectedDate.value = new Date()
}

function onSelectDate(date) {
  selectedDate.value = date
  const y = date.getFullYear()
  const m = date.getMonth()
  if (y !== currentDate.value.getFullYear() || m !== currentDate.value.getMonth()) {
    currentDate.value = new Date(y, m, 1)
  }
}

function formatTime(event) {
  if (event.is_all_day) return 'Весь день'
  const start = new Date(event.start_date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
  if (event.end_date) {
    const end = new Date(event.end_date).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
    return `${start} - ${end}`
  }
  return start
}

function getDuration(event) {
  if (!event.end_date || event.is_all_day) return null
  const ms = new Date(event.end_date) - new Date(event.start_date)
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (h > 0) return m > 0 ? `${h}ч ${m}м` : `${h}ч`
  return `${m}м`
}

function formatShortDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('ru', { day: 'numeric', month: 'short' })
}

async function fetchData() {
  loading.value = true
  try {
    events.value = await lmsApi.getCalendarData()
  } catch (e) {
    console.error('Ошибка загрузки календаря:', e)
    events.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
