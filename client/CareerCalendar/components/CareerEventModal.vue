<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop" @click.self="emit('close')">
      <div class="modal-container">
        <div class="card border-0 shadow">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Детали мероприятия</h5>
            <button class="btn-close" @click="emit('close')" />
          </div>
          <div class="card-body">
            <h5 class="mb-3">{{ event.title }}</h5>

            <div class="d-flex gap-2 mb-3">
              <span class="badge" :class="typeBadgeClass">{{ typeLabel }}</span>
              <span class="badge" :class="statusBadgeClass">{{ statusLabel }}</span>
            </div>

            <p class="text-muted">{{ event.description }}</p>

            <ul class="list-unstyled">
              <li class="d-flex align-items-center mb-2">
                <Calendar :size="16" class="text-muted me-2 flex-shrink-0 align-middle" />
                <span><strong>Дата:</strong> {{ formattedDate }}</span>
              </li>
              <li class="d-flex align-items-center mb-2">
                <MapPin :size="16" class="text-muted me-2 flex-shrink-0 align-middle" />
                <span><strong>Место:</strong> {{ event.location }}</span>
              </li>
              <li class="d-flex align-items-center mb-2">
                <Users :size="16" class="text-muted me-2 flex-shrink-0 align-middle" />
                <span>
                  <strong>Участники:</strong>
                  {{ event.participantsCount }} / {{ event.maxParticipants }}
                </span>
              </li>
              <li class="d-flex align-items-center mb-2">
                <User :size="16" class="text-muted me-2 flex-shrink-0 align-middle" />
                <span><strong>Организатор:</strong> {{ event.organizer }}</span>
              </li>
            </ul>

            <div class="progress mt-3" style="height: 8px;">
              <div
                class="progress-bar"
                :class="fillPercentage >= 100 ? 'bg-danger' : 'bg-primary'"
                :style="{ width: fillPercentage + '%' }"
              />
            </div>
            <small class="text-muted">
              Заполненность: {{ fillPercentage }}%
            </small>
          </div>
          <div class="card-footer bg-white text-end">
            <button class="btn btn-secondary" @click="emit('close')">Закрыть</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { Calendar, MapPin, Users, User } from 'lucide-vue-next'

const props = defineProps({
  event: { type: Object, required: true },
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

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

const fillPercentage = computed(() => {
  if (!props.event.maxParticipants) return 0
  return Math.round((props.event.participantsCount / props.event.maxParticipants) * 100)
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-container {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 1rem;
}
</style>
