<script setup>
import { ref, onMounted } from 'vue'
import { Briefcase, Route } from 'lucide-vue-next'
import RoleGuard from '../components/RoleGuard.vue'
import { lmsApi } from '../js/lmsApi'
import TrajectoryHero from './TrajectoryHero.vue'
import TrajectoryPathsSection from './TrajectoryPathsSection.vue'
import TrajectorySkeleton from './TrajectorySkeleton.vue'
import './learning-trajectories.scss'

const loading = ref(true)
const overview = ref(null)

onMounted(async () => {
  try {
    const res = await lmsApi.getLearningTrajectoriesOverview()
    overview.value = res.data || null
  } catch (e) {
    console.error(e)
    overview.value = null
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <RoleGuard
    :roles="['teacher', 'admin']"
    fallback-message="Раздел доступен преподавателям и администраторам"
  >
    <div class="learning-trajectories-view container-fluid py-3">
      <TrajectorySkeleton v-if="loading" />

      <template v-else-if="overview">
        <TrajectoryHero
          :intro="overview.intro"
          :stats="overview.summaryStats"
        >
          <template #actions>
            <div class="d-flex flex-wrap gap-2 justify-content-lg-end">
              <router-link
                class="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
                :to="{ name: 'LMSEmployerInteraction' }"
              >
                <Briefcase :size="16" />
                Взаимодействия с работодателями
              </router-link>
              <router-link
                class="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
                :to="{ name: 'LMSTrajectory' }"
              >
                <Route :size="16" />
                Личная траектория
              </router-link>
            </div>
          </template>
        </TrajectoryHero>

        <div class="row g-4 align-items-start">
          <div class="col-12 col-lg-7">
            <TrajectoryPathsSection
              section-title="Общие траектории"
              section-lead="Основной образовательный путь по программе или профилю."
              stage-label="Ключевые этапы"
              :items="overview.generalTrajectories"
              :use-stages="true"
            />
          </div>
          <div class="col-12 col-lg-5">
            <TrajectoryPathsSection
              section-title="Дополнительные траектории"
              section-lead="Практика, мероприятия и проекты с индустрией."
              context-label="Контекст внедрения"
              :items="overview.additionalTrajectories"
              :use-stages="false"
            />

          </div>
        </div>
      </template>

      <div v-else class="alert alert-warning mb-0">
        Не удалось загрузить данные обзора.
      </div>
    </div>
  </RoleGuard>
</template>
