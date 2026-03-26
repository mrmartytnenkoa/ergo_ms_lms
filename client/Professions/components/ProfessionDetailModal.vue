<script setup>
import { computed } from 'vue'
import { X, Banknote, TrendingUp, GraduationCap, Award } from 'lucide-vue-next'

const props = defineProps({
  profession: { type: Object, required: true },
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const demandVariant = computed(() => {
  const map = { high: 'success', medium: 'warning', low: 'danger' }
  return map[props.profession.demand] || 'secondary'
})

const demandLabel = computed(() => {
  const map = { high: 'Высокий спрос', medium: 'Средний спрос', low: 'Низкий спрос' }
  return map[props.profession.demand] || props.profession.demand
})

const formattedSalary = computed(() => {
  if (!props.profession.avgSalary) return '—'
  return props.profession.avgSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' \u20BD'
})

const matchPercent = computed(() => Math.round(props.profession.matchScore || 0))

const progressVariant = computed(() => {
  if (matchPercent.value >= 70) return 'bg-success'
  if (matchPercent.value >= 40) return 'bg-warning'
  return 'bg-danger'
})

const onOverlayClick = (e) => {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click="onOverlayClick">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ profession.name }}</h5>
            <button type="button" class="btn-close" @click="emit('close')" />
          </div>

          <div class="modal-body">
            <div class="d-flex flex-wrap gap-2 mb-3">
              <span class="badge bg-primary bg-opacity-10 text-primary">
                {{ profession.field }}
              </span>
              <span
                class="badge"
                :class="`bg-${demandVariant} bg-opacity-10 text-${demandVariant}`"
              >
                {{ demandLabel }}
              </span>
            </div>

            <p class="mb-3">{{ profession.description }}</p>

            <div class="row g-3 mb-3">
              <div class="col-sm-6">
                <div class="d-flex align-items-center gap-2">
                  <Banknote :size="18" class="text-muted flex-shrink-0" />
                  <div>
                    <div class="text-muted small">Средняя зарплата</div>
                    <div class="fw-semibold">{{ formattedSalary }}</div>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="d-flex align-items-center gap-2">
                  <TrendingUp :size="18" class="text-muted flex-shrink-0" />
                  <div>
                    <div class="text-muted small">Совпадение профиля</div>
                    <div class="d-flex align-items-center gap-2">
                      <div class="progress flex-grow-1" style="height: 6px; min-width: 80px;">
                        <div
                          class="progress-bar"
                          :class="progressVariant"
                          :style="{ width: matchPercent + '%' }"
                        />
                      </div>
                      <span class="fw-semibold small">{{ matchPercent }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="profession.requiredCompetencies?.length"
              class="mb-3"
            >
              <h6 class="d-flex align-items-center gap-2 mb-2">
                <Award :size="16" class="flex-shrink-0" />
                Требуемые компетенции
              </h6>
              <div class="d-flex flex-wrap gap-1">
                <span
                  v-for="comp in profession.requiredCompetencies"
                  :key="comp"
                  class="badge bg-secondary bg-opacity-10 text-secondary"
                >
                  {{ comp }}
                </span>
              </div>
            </div>

            <div v-if="profession.educationPrograms?.length">
              <h6 class="d-flex align-items-center gap-2 mb-2">
                <GraduationCap :size="16" class="flex-shrink-0" />
                Образовательные программы
              </h6>
              <div class="table-responsive">
                <table class="table table-sm table-bordered mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Программа</th>
                      <th>Учреждение</th>
                      <th>Длительность</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="prog in profession.educationPrograms" :key="prog.name">
                      <td>{{ prog.name }}</td>
                      <td>{{ prog.institution }}</td>
                      <td>{{ prog.duration }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="emit('close')">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-dialog {
  max-height: 90vh;
}
.modal-content {
  background-color: var(--color-primary-background, #fff);
}
</style>
