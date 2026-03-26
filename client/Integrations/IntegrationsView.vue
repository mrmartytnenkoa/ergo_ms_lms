<script setup>
import { ref, onMounted } from 'vue'
import { lmsApi } from '../js/lmsApi.js'
import { Puzzle, Loader2 } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import IntegrationCard from './components/IntegrationCard.vue'
import IntegrationSettingsModal from './components/IntegrationSettingsModal.vue'
import SyncStatusPanel from './components/SyncStatusPanel.vue'

const toast = useToast()

const loading = ref(true)
const error = ref(null)
const integrations = ref([])
const selectedIntegration = ref(null)
const showSettings = ref(false)

async function loadIntegrations() {
  loading.value = true
  error.value = null
  try {
    const res = await lmsApi.getIntegrations()
    integrations.value = res.data
  } catch (e) {
    error.value = 'Не удалось загрузить интеграции'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openSettings(integration) {
  selectedIntegration.value = { ...integration }
  showSettings.value = true
}

function closeSettings() {
  showSettings.value = false
  selectedIntegration.value = null
}

function onSave(updated) {
  const idx = integrations.value.findIndex(i => i.id === updated.id)
  if (idx >= 0) integrations.value[idx] = { ...updated }
  toast.success('Настройки сохранены')
  closeSettings()
}

function onSync(integration) {
  toast.info(`Синхронизация "${integration.name}" запущена`)
}

onMounted(loadIntegrations)
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center mb-4">
      <Puzzle :size="28" class="me-2 text-primary" />
      <h2 class="mb-0">Интеграции</h2>
    </div>

    <div v-if="loading" class="text-center py-5">
      <Loader2 :size="40" class="spinner-icon text-primary" />
      <p class="mt-3 text-muted">Загрузка интеграций...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <template v-else>
      <div class="row g-3 mb-4">
        <div
          v-for="integration in integrations"
          :key="integration.id"
          class="col-12 col-sm-6 col-lg-4"
        >
          <IntegrationCard
            :integration="integration"
            @click="openSettings(integration)"
            @sync="onSync(integration)"
          />
        </div>

        <div v-if="integrations.length === 0" class="col-12 text-center text-muted py-4">
          Интеграции не настроены
        </div>
      </div>

      <SyncStatusPanel :integrations="integrations" />
    </template>

    <IntegrationSettingsModal
      :integration="selectedIntegration"
      :show="showSettings"
      @close="closeSettings"
      @save="onSave"
    />
  </div>
</template>

<style scoped>
.spinner-icon {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
