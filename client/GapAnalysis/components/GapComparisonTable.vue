<template>
  <div class="card border-0 shadow-sm">
    <div class="card-header bg-white">
      <h5 class="mb-0">Таблица разрывов</h5>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>Специализация</th>
              <th class="text-center">Интерес студентов (%)</th>
              <th class="text-center">Спрос работодателей (%)</th>
              <th class="text-center">Разрыв</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in sortedGaps" :key="item.specialization">
              <td class="fw-medium">{{ item.specialization }}</td>
              <td class="text-center">{{ item.studentInterest }}</td>
              <td class="text-center">{{ item.employerDemand }}</td>
              <td class="text-center">
                <span class="badge" :class="gapBadgeClass(item.gap)">
                  {{ item.gap > 0 ? '+' : '' }}{{ item.gap }}
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
import { computed } from 'vue'

const props = defineProps({
  gaps: {
    type: Array,
    required: true
  }
})

const sortedGaps = computed(() =>
  [...props.gaps].sort((a, b) => a.gap - b.gap)
)

function gapBadgeClass(gap) {
  if (gap < 0) return 'bg-danger'
  if (gap > 0) return 'bg-success'
  return 'bg-secondary'
}
</script>
