<script setup>
import { ref, onMounted } from 'vue'
import { Briefcase, ListChecks } from 'lucide-vue-next'
import { lmsApi } from '../js/lmsApi.js'
import CompetencyCard from './components/CompetencyCard.vue'
import DevelopmentPlanWidget from './components/DevelopmentPlanWidget.vue'

const competencies = ref([])
const plan = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const [compRes, planRes] = await Promise.all([
      lmsApi.getCompetencies(),
      lmsApi.getDevelopmentPlan()
    ])
    competencies.value = compRes.data
    plan.value = planRes.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center mb-4">
      <Briefcase :size="24" class="me-2 text-primary" />
      <h4 class="mb-0">Профессиональное развитие</h4>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Загрузка данных...</p>
    </div>

    <template v-else>
      <section class="mb-5">
        <h5 class="d-flex align-items-center mb-3">
          <Briefcase :size="20" class="me-2 text-primary" />
          Мои компетенции
        </h5>
        <div v-if="competencies.length === 0" class="text-muted text-center py-4">
          Компетенции ещё не определены
        </div>
        <div v-else class="row g-3">
          <div v-for="comp in competencies" :key="comp.id" class="col-sm-6 col-lg-4 col-xl-3">
            <CompetencyCard :competency="comp" />
          </div>
        </div>
      </section>

      <section>
        <h5 class="d-flex align-items-center mb-3">
          <ListChecks :size="20" class="me-2 text-primary" />
          План развития
        </h5>
        <DevelopmentPlanWidget v-if="plan" :plan="plan" />
        <div v-else class="text-muted text-center py-4">
          План развития ещё не сформирован
        </div>
      </section>
    </template>
  </div>
</template>
