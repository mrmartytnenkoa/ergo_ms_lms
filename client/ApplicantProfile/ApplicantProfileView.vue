<script setup>
import { ref, onMounted } from 'vue'
import { User } from 'lucide-vue-next'
import UserAvatar from '@/components/UserAvatar.vue'
import { lmsApi } from '../js/lmsApi.js'
import PersonalInfoCard from './components/PersonalInfoCard.vue'
import EducationInfoCard from './components/EducationInfoCard.vue'

const profile = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await lmsApi.getApplicantProfile()
    profile.value = res.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center mb-4">
      <User :size="24" class="me-2 text-primary" />
      <h4 class="mb-0">Профиль абитуриента</h4>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Загрузка профиля...</p>
    </div>

    <template v-else-if="profile">
      <div class="d-flex align-items-center mb-4">
        <UserAvatar :size="64" :title="profile.lastName + ' ' + profile.firstName" />
        <div class="ms-3">
          <h5 class="mb-1">{{ profile.lastName }} {{ profile.firstName }} {{ profile.middleName }}</h5>
          <span class="text-muted">{{ profile.institution }}</span>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <PersonalInfoCard :profile="profile" />
        </div>
        <div class="col-md-6">
          <EducationInfoCard :profile="profile" />
        </div>
      </div>
    </template>

    <div v-else class="alert alert-warning">
      Не удалось загрузить профиль абитуриента.
    </div>
  </div>
</template>
