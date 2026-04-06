<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  BookOpen, Play, CheckCircle, Clock, Users, Star, Search,
  ArrowRight, Award, Pause, GraduationCap, Video,
  FileText, PenTool
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { lmsApi } from '../js/lmsApi'
import CourseImagePlaceholder from '../components/CourseImagePlaceholder.vue'

const router = useRouter()
const courses = ref([])
const loading = ref(true)
const searchQuery = ref('')
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'В процессе' },
  { key: 'completed', label: 'Завершённые' },
  { key: 'favorite', label: 'Избранные' }
]

function tabCount(key) {
  if (key === 'all') return courses.value.length
  if (key === 'favorite') return courses.value.filter(c => c.isFavorite).length
  if (key === 'active') return courses.value.filter(c => c.status === 'active' || c.status === 'paused').length
  return courses.value.filter(c => c.status === key).length
}

const filteredCourses = computed(() => {
  let filtered = courses.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.instructor?.toLowerCase().includes(q)
    )
  }

  if (activeTab.value !== 'all') {
    if (activeTab.value === 'favorite') {
      filtered = filtered.filter(c => c.isFavorite)
    } else if (activeTab.value === 'active') {
      filtered = filtered.filter(c => c.status === 'active' || c.status === 'paused')
    } else {
      filtered = filtered.filter(c => c.status === activeTab.value)
    }
  }

  return filtered
})

async function fetchCourses() {
  loading.value = true
  try {
    const response = await lmsApi.getMyCourses()
    courses.value = response.data || []
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error)
    courses.value = []
  } finally {
    loading.value = false
  }
}

function getStatusBadge(status) {
  const map = {
    active: { cls: 'bg-primary', text: 'В процессе' },
    completed: { cls: 'bg-success', text: 'Завершён' },
    paused: { cls: 'bg-warning text-dark', text: 'Пауза' }
  }
  return map[status] || { cls: 'bg-secondary', text: status }
}

function progressBarClass(course) {
  if (course.status === 'paused') return 'progress-color-paused'
  if (course.status === 'completed') return 'progress-color-done'
  return course.progress >= 50 ? 'progress-color-mid' : 'progress-color-low'
}

function lessonTypeIcon(type) {
  const map = { video: Video, lecture: FileText, practice: PenTool }
  return map[type] || FileText
}

function getCourseImageUrl(course) {
  if (course.image && typeof course.image === 'string') {
    return course.image.startsWith('http') ? course.image : `${window.location.origin}${course.image}`
  }
  return null
}

function openCourse(course) {
  const id = course.subjectId ?? course.subject?.id ?? course.id
  if (id) router.push({ name: 'LMSCourseView', params: { id } })
}

async function toggleFavorite(course) {
  course.isFavorite = !course.isFavorite
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(fetchCourses)
</script>

<template>
  <div class="courses-view">
    <h3 class="mb-4">Мои курсы</h3>

    <!-- Tabs + Search -->
    <div class="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
      <ul class="nav filter-tabs">
        <li v-for="tab in tabs" :key="tab.key" class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span class="badge bg-secondary bg-opacity-25 text-body ms-1">{{ tabCount(tab.key) }}</span>
          </button>
        </li>
      </ul>
      <div class="input-group search-input">
        <span class="input-group-text"><Search :size="16" class="text-muted" /></span>
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Поиск курсов..." />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredCourses.length === 0" class="text-center py-5">
      <BookOpen :size="48" class="text-muted mb-3" />
      <h5 class="text-muted">Курсы не найдены</h5>
      <p class="text-muted">Попробуйте изменить критерии поиска или запишитесь на новые курсы</p>
    </div>

    <!-- Course grid -->
    <div v-else class="row g-4">
      <div v-for="course in filteredCourses" :key="course.id" class="col-lg-6 col-xl-4">
        <div class="card course-card shadow-sm h-100">
          <!-- Image -->
          <div class="course-image">
            <img v-if="getCourseImageUrl(course)" :src="getCourseImageUrl(course)" :alt="course.name" />
            <CourseImagePlaceholder v-else height="180px" :text="course.name || 'Курс'" />

            <div class="course-overlay">
              <button class="btn btn-light btn-sm fw-semibold" @click="openCourse(course)">
                <Play :size="16" class="me-1" />
                {{ course.status === 'completed' ? 'Повторить' : 'Продолжить' }}
              </button>
            </div>

            <div class="course-badges">
              <span :class="`badge ${getStatusBadge(course.status).cls}`">{{ getStatusBadge(course.status).text }}</span>
              <span v-if="course.course_format" class="badge bg-dark bg-opacity-75">{{ course.course_format }}</span>
            </div>

            <div class="course-favorite" @click.stop="toggleFavorite(course)">
              <Star :size="16" :class="course.isFavorite ? 'text-warning filled' : 'text-white'" />
            </div>
          </div>

          <!-- Body -->
          <div class="card-body d-flex flex-column">
            <div class="mb-1">
              <span v-if="course.category" class="badge bg-light text-muted border me-1">{{ course.category }}</span>
            </div>
            <h6 class="fw-bold mb-1">{{ course.name }}</h6>
            <p class="text-muted small mb-2 flex-grow-0" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">{{ course.description }}</p>

            <div class="d-flex align-items-center gap-3 text-muted small mb-3">
              <span class="d-flex align-items-center gap-1"><GraduationCap :size="14" /> {{ course.instructor }}</span>
              <span class="d-flex align-items-center gap-1"><Users :size="14" /> {{ course.studentsCount }}</span>
              <span v-if="course.rating" class="d-flex align-items-center gap-1"><Star :size="14" class="text-warning" /> {{ course.rating }}</span>
            </div>

            <!-- Progress -->
            <div class="mb-2">
              <div class="d-flex justify-content-between small mb-1">
                <span class="text-muted">{{ course.lessonsCompleted }} из {{ course.lessonsTotal }} уроков</span>
                <span class="fw-bold">{{ course.progress }}%</span>
              </div>
              <div class="progress" style="height:5px;">
                <div class="progress-bar" :class="progressBarClass(course)" :style="`width:${course.progress}%`"></div>
              </div>
            </div>

            <!-- Next lesson -->
            <div v-if="course.nextLesson" class="next-lesson-block mt-auto">
              <div>
                <div class="next-label">Следующий урок</div>
                <div class="next-name d-flex align-items-center gap-1">
                  <component :is="lessonTypeIcon(course.nextLesson.type)" :size="14" class="text-primary flex-shrink-0" />
                  {{ course.nextLesson.name }}
                </div>
              </div>
              <button class="btn btn-sm btn-outline-primary flex-shrink-0" @click="openCourse(course)">
                <ArrowRight :size="14" />
              </button>
            </div>

            <!-- Completed info -->
            <div v-else-if="course.status === 'completed'" class="completed-badge mt-auto">
              <CheckCircle :size="18" class="text-success flex-shrink-0" />
              <div class="small">
                <span class="fw-semibold text-success">Курс завершён</span>
                <span v-if="course.completedDate" class="text-muted ms-1">{{ formatDate(course.completedDate) }}</span>
              </div>
              <Award v-if="course.certificate" :size="18" class="text-warning ms-auto flex-shrink-0" title="Сертификат получен" />
            </div>

            <!-- Paused info -->
            <div v-else-if="course.status === 'paused'" class="next-lesson-block mt-auto">
              <div class="d-flex align-items-center gap-2">
                <Pause :size="16" class="text-warning flex-shrink-0" />
                <span class="small text-muted">Курс приостановлен</span>
              </div>
              <button class="btn btn-sm btn-outline-warning flex-shrink-0" @click="openCourse(course)">Возобновить</button>
            </div>

            <!-- Footer meta -->
            <div class="d-flex justify-content-between text-muted mt-2" style="font-size:0.72rem;">
              <span><Clock :size="12" /> Записан {{ formatDate(course.enrollmentDate) }}</span>
              <span v-if="course.lastAccessed">Был {{ formatDate(course.lastAccessed) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './courses.scss';
</style>
