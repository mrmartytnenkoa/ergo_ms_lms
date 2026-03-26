<script setup>
import { ref, watch } from 'vue'
import { Settings, Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  integration: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const url = ref('')
const apiKey = ref('')
const syncInterval = ref('60')
const showApiKey = ref(false)

const intervals = [
  { value: '15', label: 'Каждые 15 минут' },
  { value: '30', label: 'Каждые 30 минут' },
  { value: '60', label: 'Каждый час' },
  { value: '360', label: 'Каждые 6 часов' },
  { value: '1440', label: 'Каждый день' }
]

watch(() => props.integration, (val) => {
  if (val) {
    url.value = val.url || ''
    apiKey.value = val.apiKey || ''
    syncInterval.value = val.syncInterval?.toString() || '60'
    showApiKey.value = false
  }
}, { immediate: true })

function save() {
  emit('save', {
    ...props.integration,
    url: url.value,
    apiKey: apiKey.value,
    syncInterval: parseInt(syncInterval.value)
  })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show && integration" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-dialog modal-dialog-centered" style="max-width: 520px">
        <div class="modal-content shadow-lg">
          <div class="modal-header">
            <div class="d-flex align-items-center">
              <Settings :size="20" class="me-2 text-primary" />
              <h5 class="modal-title mb-0">
                Настройки: {{ integration.name }}
              </h5>
            </div>
            <button class="btn-close" @click="emit('close')" />
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">URL</label>
              <input v-model="url" type="url" class="form-control" placeholder="https://..." />
            </div>

            <div class="mb-3">
              <label class="form-label">API-ключ</label>
              <div class="input-group">
                <input
                  v-model="apiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Введите API-ключ"
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="showApiKey = !showApiKey"
                >
                  <Eye v-if="showApiKey" :size="16" />
                  <EyeOff v-else :size="16" />
                </button>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Интервал синхронизации</label>
              <select v-model="syncInterval" class="form-select">
                <option v-for="opt in intervals" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="emit('close')">
              Отмена
            </button>
            <button class="btn btn-primary" @click="save">
              Сохранить
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
</style>
