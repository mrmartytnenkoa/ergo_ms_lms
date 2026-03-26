<template>
  <div class="calendar-grid-wrapper">
    <div class="calendar-grid">
      <div class="calendar-header-cell" v-for="day in weekDays" :key="day">{{ day }}</div>

      <div
        v-for="(cell, idx) in calendarCells"
        :key="idx"
        class="calendar-day"
        :class="{
          'calendar-day--other-month': !cell.isCurrentMonth,
          'calendar-day--today': cell.isToday,
          'calendar-day--selected': cell.isSelected
        }"
        @click="$emit('select-date', cell.date)"
      >
        <span class="day-number">{{ cell.day }}</span>
        <div class="event-dots" v-if="cell.events.length > 0">
          <span
            v-for="(evt, i) in cell.events.slice(0, 3)"
            :key="evt.id"
            class="event-dot"
            :class="`event-dot--${evt.color || 'primary'}`"
            :title="evt.title"
          ></span>
          <span v-if="cell.events.length > 3" class="event-dot-more">+{{ cell.events.length - 3 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentDate: { type: Date, required: true },
  events: { type: Array, default: () => [] },
  selectedDate: { type: Date, default: null }
})

defineEmits(['select-date'])

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const calendarCells = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let startDow = firstDay.getDay()
  startDow = startDow === 0 ? 6 : startDow - 1

  const cells = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const prevMonthLast = new Date(year, month, 0)
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLast.getDate() - i)
    cells.push(buildCell(d, false, today))
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    cells.push(buildCell(new Date(year, month, day), true, today))
  }

  const remaining = 42 - cells.length
  for (let i = 1; i <= remaining; i++) {
    cells.push(buildCell(new Date(year, month + 1, i), false, today))
  }

  return cells
})

function buildCell(date, isCurrentMonth, today) {
  const dateKey = toDateKey(date)
  const eventsForDay = props.events.filter(e => toDateKey(new Date(e.start_date)) === dateKey)
  const isToday = date.getTime() === today.getTime()
  const isSelected = props.selectedDate && toDateKey(props.selectedDate) === dateKey

  return {
    date,
    day: date.getDate(),
    isCurrentMonth,
    isToday,
    isSelected,
    events: eventsForDay
  }
}

function toDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>
