<template>
  <div class="card border-0 shadow-sm h-100 event-card" role="button" @click="emit('select', event)">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <span class="badge" :class="typeBadgeClass">{{ typeLabel }}</span>
        <span class="badge" :class="statusBadgeClass">{{ statusLabel }}</span>
      </div>

      <h6 class="card-title mb-2">{{ event.title }}</h6>

      <div class="d-flex align-items-center text-muted small mb-1">
        <Calendar :size="14" class="me-1 flex-shrink-0 align-middle" />
        {{ formattedDate }}
      </div>
      <div class="d-flex align-items-center text-muted small mb-1">
        <MapPin :size="14" class="me-1 flex-shrink-0 align-middle" />
        {{ event.location }}
      </div>
      <div class="d-flex align-items-center text-muted small mb-1">
        <Users :size="14" class="me-1 flex-shrink-0 align-middle" />
        {{ event.participantsCount }} / {{ event.maxParticipants }}
      </div>
      <div class="d-flex align-items-center text-muted small">
        <User :size="14" class="me-1 flex-shrink-0 align-middle" />
        {{ event.organizer }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Calendar, MapPin, Users, User } from 'lucide-vue-next'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const typeMap = {
  masterclass: { label: 'Мастер-класс', class: 'bg-primary' },
  excursion: { label: 'Экскурсия', class: 'bg-success' },
  fair: { label: 'Ярмарка', class: 'bg-warning text-dark' },
  lecture: { label: 'Лекция', class: 'bg-info' },
  workshop: { label: 'Воркшоп', class: 'bg-secondary' }
}

const statusMap = {
  upcoming: { label: 'Предстоит', class: 'bg-primary bg-opacity-10 text-primary' },
  completed: { label: 'Завершено', class: 'bg-success bg-opacity-10 text-success' },
  cancelled: { label: 'Отменено', class: 'bg-danger bg-opacity-10 text-danger' }
}

const typeLabel = computed(() => typeMap[props.event.type]?.label || props.event.type)
const typeBadgeClass = computed(() => typeMap[props.event.type]?.class || 'bg-secondary')
const statusLabel = computed(() => statusMap[props.event.status]?.label || props.event.status)
const statusBadgeClass = computed(() => statusMap[props.event.status]?.class || 'bg-secondary')

const formattedDate = computed(() => {
  const d = new Date(props.event.date)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>

<style scoped>
.event-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  cursor: pointer;
}
.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}
</style>
