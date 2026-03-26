<script setup>
import { ref, computed, onMounted } from 'vue'
import { lmsApi } from '../js/lmsApi.js'
import { GraduationCap, Loader2 } from 'lucide-vue-next'
import StudentFilters from './components/StudentFilters.vue'
import StudentTable from './components/StudentTable.vue'
import StudentDetailModal from './components/StudentDetailModal.vue'

const loading = ref(true)
const error = ref(null)
const students = ref([])
const selectedStudent = ref(null)
const showModal = ref(false)
const filters = ref({ search: '', status: '' })

const filteredStudents = computed(() => {
  let list = students.value
  const { search, status } = filters.value

  if (search) {
    const q = search.toLowerCase()
    list = list.filter(s =>
      `${s.lastName} ${s.firstName}`.toLowerCase().includes(q) ||
      s.group?.toLowerCase().includes(q)
    )
  }

  if (status) {
    list = list.filter(s => s.status === status)
  }

  return list
})

async function loadStudents() {
  loading.value = true
  error.value = null
  try {
    const res = await lmsApi.getStudentsList()
    students.value = res.data
  } catch (e) {
    error.value = 'Не удалось загрузить список студентов'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function onSelectStudent(student) {
  selectedStudent.value = student
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedStudent.value = null
}

onMounted(loadStudents)
</script>

<template>
  <div class="container-fluid py-4">
    <div class="d-flex align-items-center mb-4">
      <GraduationCap :size="28" class="me-2 text-primary" />
      <h2 class="mb-0">Управление студентами</h2>
    </div>

    <StudentFilters v-model="filters" class="mb-4" />

    <div v-if="loading" class="text-center py-5">
      <Loader2 :size="40" class="spinner-icon text-primary" />
      <p class="mt-3 text-muted">Загрузка...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else class="card shadow-sm">
      <div class="card-body p-0">
        <StudentTable :students="filteredStudents" @select="onSelectStudent" />
      </div>
    </div>

    <StudentDetailModal
      :student="selectedStudent"
      :show="showModal"
      @close="closeModal"
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
