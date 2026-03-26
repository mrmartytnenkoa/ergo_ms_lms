<template>
  <div class="career-calendar-page">
    <div class="container-fluid py-4">
      <h1 class="h3 mb-4">Календарь мероприятий</h1>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
      </div>

      <template v-else>
        <CareerEventFilters v-model="selectedType" class="mb-4" />

        <div class="row g-4">
          <div class="col-lg-8">
            <div v-if="filteredEvents.length === 0" class="alert alert-info">
              Нет мероприятий для выбранного фильтра.
            </div>
            <div class="row g-3">
              <div
                v-for="event in filteredEvents"
                :key="event.id"
                class="col-md-6"
              >
                <CareerEventCard :event="event" @select="openEvent" />
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white d-flex justify-content-between align-items-center">
                <button class="btn btn-sm btn-outline-secondary" @click="prevMonth">
                  <ChevronLeft :size="16" />
                </button>
                <h6 class="mb-0">{{ monthLabel }}</h6>
                <button class="btn btn-sm btn-outline-secondary" @click="nextMonth">
                  <ChevronRight :size="16" />
                </button>
              </div>
              <div class="card-body p-2">
                <div class="mini-calendar">
                  <div class="row g-0 text-center mb-1">
                    <div
                      v-for="day in weekDays"
                      :key="day"
                      class="col fw-bold small text-muted py-1"
                    >
                      {{ day }}
                    </div>
                  </div>
                  <div
                    v-for="(week, wi) in calendarWeeks"
                    :key="wi"
                    class="row g-0 text-center"
                  >
                    <div
                      v-for="(d, di) in week"
                      :key="di"
                      class="col py-1"
                    >
                      <span
                        v-if="d"
                        class="d-inline-flex align-items-center justify-content-center rounded-circle"
                        :class="{
                          'bg-primary text-white': isToday(d),
                          'bg-primary bg-opacity-10 text-primary fw-bold': hasEvent(d) && !isToday(d)
                        }"
                        style="width: 30px; height: 30px; font-size: 0.85rem; cursor: default;"
                      >
                        {{ d }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <CareerEventModal
        v-if="selectedEvent"
        :event="selectedEvent"
        :show="!!selectedEvent"
        @close="selectedEvent = null"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { lmsApi } from '../js/lmsApi.js'
import CareerEventFilters from './components/CareerEventFilters.vue'
import CareerEventCard from './components/CareerEventCard.vue'
import CareerEventModal from './components/CareerEventModal.vue'

const loading = ref(false)
const events = ref([])
const selectedType = ref('all')
const selectedEvent = ref(null)

const now = new Date()
const currentMonth = ref(now.getMonth())
const currentYear = ref(now.getFullYear())

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const monthLabel = computed(() =>
  `${monthNames[currentMonth.value]} ${currentYear.value}`
)

const filteredEvents = computed(() => {
  if (selectedType.value === 'all') return events.value
  return events.value.filter(e => e.type === selectedType.value)
})

const eventDates = computed(() => {
  const dates = new Set()
  events.value.forEach(e => {
    const d = new Date(e.date)
    if (d.getMonth() === currentMonth.value && d.getFullYear() === currentYear.value) {
      dates.add(d.getDate())
    }
  })
  return dates
})

const calendarWeeks = computed(() => {
  const first = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  let startDay = first.getDay() - 1
  if (startDay < 0) startDay = 6

  const weeks = []
  let week = new Array(startDay).fill(null)

  for (let d = 1; d <= lastDay; d++) {
    week.push(d)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
})

function hasEvent(day) {
  return eventDates.value.has(day)
}

function isToday(day) {
  return (
    day === now.getDate() &&
    currentMonth.value === now.getMonth() &&
    currentYear.value === now.getFullYear()
  )
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function openEvent(event) {
  selectedEvent.value = event
}

async function loadData() {
  loading.value = true
  try {
    const response = await lmsApi.getCareerEvents()
    events.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки мероприятий:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
