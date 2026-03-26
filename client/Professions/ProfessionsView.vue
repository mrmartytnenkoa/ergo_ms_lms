<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Loader } from 'lucide-vue-next'
import { lmsApi } from '../js/lmsApi.js'
import ProfessionCard from './components/ProfessionCard.vue'
import ProfessionFilters from './components/ProfessionFilters.vue'
import ProfessionDetailModal from './components/ProfessionDetailModal.vue'

const professions = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedField = ref('')
const selectedProfession = ref(null)
const showDetail = ref(false)

const fields = computed(() => [...new Set(professions.value.map(p => p.field))])

const filteredProfessions = computed(() => {
  let result = professions.value
  if (selectedField.value) {
    result = result.filter(p => p.field === selectedField.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }
  return result
})

const openDetail = (profession) => {
  selectedProfession.value = profession
  showDetail.value = true
}

onMounted(async () => {
  try {
    const res = await lmsApi.getProfessions()
    professions.value = res.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container-fluid py-3">
    <h4 class="mb-4">Перечень профессий и карьер</h4>

    <div class="row g-3 mb-4 align-items-end">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="input-group">
          <span class="input-group-text">
            <Search :size="16" />
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Поиск профессии..."
          />
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <ProfessionFilters v-model="selectedField" :fields="fields" />
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <Loader :size="32" class="spinner-border" />
      <p class="mt-2 text-muted">Загрузка профессий...</p>
    </div>

    <div v-else-if="filteredProfessions.length === 0" class="text-center py-5 text-muted">
      Профессии не найдены
    </div>

    <div v-else class="row g-3">
      <div
        v-for="profession in filteredProfessions"
        :key="profession.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <ProfessionCard :profession="profession" @click="openDetail(profession)" />
      </div>
    </div>

    <ProfessionDetailModal
      v-if="selectedProfession"
      :profession="selectedProfession"
      :show="showDetail"
      @close="showDetail = false"
    />
  </div>
</template>
