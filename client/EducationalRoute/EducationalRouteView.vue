<script setup>
import { ref, onMounted } from 'vue'
import { Route, Map } from 'lucide-vue-next'
import { lmsApi } from '../js/lmsApi.js'
import RouteProgress from './components/RouteProgress.vue'
import RouteStageCard from './components/RouteStageCard.vue'
import RouteMap from './components/RouteMap.vue'

const stages = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await lmsApi.getEducationalRoute()
    stages.value = res.data?.stages || []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center mb-4">
      <Route :size="24" class="me-2 text-primary" />
      <h4 class="mb-0">Образовательный маршрут</h4>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Загрузка маршрута...</p>
    </div>

    <template v-else>
      <RouteProgress :stages="stages" class="mb-4" />
      <RouteMap :stages="stages" class="mb-4" />

      <div v-if="stages.length === 0" class="text-center text-muted py-5">
        Образовательный маршрут ещё не сформирован
      </div>

      <div v-else class="position-relative">
        <RouteStageCard
          v-for="(stage, idx) in stages"
          :key="stage.id"
          :stage="stage"
          :is-last="idx === stages.length - 1"
        />
      </div>
    </template>
  </div>
</template>
