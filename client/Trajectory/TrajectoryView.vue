<script setup>
import { ref, onMounted } from 'vue'
import { Loader } from 'lucide-vue-next'
import { lmsApi } from '../js/lmsApi.js'
import TrajectoryTimeline from './components/TrajectoryTimeline.vue'
import TrajectoryRecommendations from './components/TrajectoryRecommendations.vue'

const stages = ref([])
const recommendations = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await lmsApi.getTrajectory()
    stages.value = res.data?.stages || []
    recommendations.value = res.data?.recommendations || []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container-fluid py-3">
    <h4 class="mb-4">Образовательная траектория</h4>

    <div v-if="loading" class="text-center py-5">
      <Loader :size="32" class="spinner-border" />
      <p class="mt-2 text-muted">Загрузка траектории...</p>
    </div>

    <template v-else>
      <div v-if="stages.length === 0" class="text-center py-5 text-muted">
        Траектория ещё не сформирована
      </div>

      <div v-else class="row g-4">
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">Этапы обучения</h6>
            </div>
            <div class="card-body">
              <TrajectoryTimeline :stages="stages" />
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <TrajectoryRecommendations :recommendations="recommendations" />
        </div>
      </div>
    </template>
  </div>
</template>
