<script setup>
import { computed } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

const impactBadge = (impact) => {
  const map = {
    high: { class: 'bg-success', label: 'Высокий' },
    medium: { class: 'bg-warning text-dark', label: 'Средний' },
    low: { class: 'bg-secondary', label: 'Низкий' }
  }
  return map[impact] || { class: 'bg-secondary', label: impact }
}

const isEmpty = computed(() => props.events.length === 0)
</script>

<template>
  <div>
    <div v-if="isEmpty" class="text-center text-muted py-4">
      Нет данных о мероприятиях
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>Название</th>
            <th>Тип</th>
            <th class="text-center">Участники</th>
            <th>Удовлетворенность</th>
            <th class="text-center">Влияние</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td class="fw-medium">{{ event.name }}</td>
            <td class="text-muted">{{ event.type }}</td>
            <td class="text-center">{{ event.participants }}</td>
            <td style="min-width: 140px">
              <div class="d-flex align-items-center gap-2">
                <div class="progress flex-grow-1" style="height: 6px">
                  <div
                    class="progress-bar"
                    :class="{
                      'bg-success': event.satisfaction >= 70,
                      'bg-warning': event.satisfaction >= 40 && event.satisfaction < 70,
                      'bg-danger': event.satisfaction < 40
                    }"
                    :style="{ width: event.satisfaction + '%' }"
                  />
                </div>
                <small class="text-muted">{{ event.satisfaction }}%</small>
              </div>
            </td>
            <td class="text-center">
              <span class="badge" :class="impactBadge(event.impact).class">
                {{ impactBadge(event.impact).label }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
