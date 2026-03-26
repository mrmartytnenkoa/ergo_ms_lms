<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  BookOpen, Search, Users, Clock, Layers, Sparkles, Star, StarHalf,
  User, Filter, X, ChevronRight, BarChart3, GraduationCap
} from 'lucide-vue-next'
import { lmsApi } from '../js/lmsApi'
import { globalUserRole } from '../composables/useUserRole'
import {
  showSuccess,
  showError,
  showWarning
} from '@/js/utils/notifications'
import CourseImagePlaceholder from '../components/CourseImagePlaceholder.vue'
import './catalog.scss'

const courses = ref([])
const categories = ref([])
const courseFormats = ref([])
const loading = ref(true)

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedDifficulties = ref([])
const selectedDurations = ref([])
const selectedRating = ref('all')
const selectedFormat = ref('all')
const selectedSort = ref('popular')
const showMobileFilters = ref(false)

const userRole = globalUserRole

const sortOptions = [
  { value: 'popular', label: 'Популярные' },
  { value: 'newest', label: 'Новые' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'name', label: 'По названию' }
]

const difficultyOptions = [
  { value: 'beginner', label: 'Начинающий' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' }
]

const durationOptions = [
  { value: 'short', label: 'до 5 часов', min: 0, max: 5 },
  { value: 'medium', label: '5 - 20 часов', min: 5, max: 20 },
  { value: 'long', label: '20 - 50 часов', min: 20, max: 50 },
  { value: 'extended', label: '50+ часов', min: 50, max: Infinity }
]

const ratingOptions = [
  { value: 'all', label: 'Все' },
  { value: '4.5', label: '4.5 и выше' },
  { value: '4.0', label: '4.0 и выше' },
  { value: '3.5', label: '3.5 и выше' }
]

const difficultyLabels = {
  beginner: 'Начинающий',
  intermediate: 'Средний',
  advanced: 'Продвинутый'
}

const difficultyColors = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger'
}

const statsData = computed(() => {
  const total = courses.value.length
  const cats = new Set(courses.value.map(c => c.category?.id || c.category)).size
  const students = courses.value.reduce((s, c) => s + (c.students_count || 0), 0)
  const now = new Date()
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const newCount = courses.value.filter(c => new Date(c.creationdate) > monthAgo).length

  return [
    { label: 'Всего курсов', value: total, icon: 'BookOpen', color: 'primary' },
    { label: 'Категорий', value: cats, icon: 'Layers', color: 'success' },
    { label: 'Студентов', value: students.toLocaleString('ru-RU'), icon: 'Users', color: 'warning' },
    { label: 'Новых', value: newCount, icon: 'Sparkles', color: 'info' }
  ]
})

const iconMap = { BookOpen, Layers, Users, Sparkles }

const categoryTabs = computed(() => {
  const counts = {}
  courses.value.forEach(c => {
    const catId = c.category?.id || c.category
    const catName = c.category?.name || 'Другое'
    if (!counts[catId]) counts[catId] = { id: catId, name: catName, count: 0 }
    counts[catId].count++
  })
  return [
    { id: 'all', name: 'Все', count: courses.value.length },
    ...Object.values(counts)
  ]
})

const hasActiveFilters = computed(() =>
  selectedDifficulties.value.length > 0 ||
  selectedDurations.value.length > 0 ||
  selectedRating.value !== 'all' ||
  selectedFormat.value !== 'all'
)

const filteredCourses = computed(() => {
  let filtered = courses.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.summary || c.description || '').toLowerCase().includes(q) ||
      (c.tags || []).some(t => t.toLowerCase().includes(q))
    )
  }

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(c => {
      const catId = c.category?.id || c.category
      return catId && catId.toString() === selectedCategory.value.toString()
    })
  }

  if (selectedDifficulties.value.length > 0) {
    filtered = filtered.filter(c => selectedDifficulties.value.includes(c.difficulty))
  }

  if (selectedDurations.value.length > 0) {
    filtered = filtered.filter(c => {
      const hours = c.duration_hours || 0
      return selectedDurations.value.some(d => {
        const opt = durationOptions.find(o => o.value === d)
        return opt && hours >= opt.min && hours < opt.max
      })
    })
  }

  if (selectedRating.value !== 'all') {
    const minRating = parseFloat(selectedRating.value)
    filtered = filtered.filter(c => (c.rating || 0) >= minRating)
  }

  if (selectedFormat.value !== 'all') {
    filtered = filtered.filter(c => {
      const fmtId = c.course_format?.id || c.course_format
      return fmtId && fmtId.toString() === selectedFormat.value.toString()
    })
  }

  filtered.sort((a, b) => {
    switch (selectedSort.value) {
      case 'name': return a.name.localeCompare(b.name)
      case 'popular': return (b.students_count || 0) - (a.students_count || 0)
      case 'rating': return (b.rating || 0) - (a.rating || 0)
      case 'newest':
      default: return new Date(b.creationdate) - new Date(a.creationdate)
    }
  })

  return filtered
})

function resetFilters() {
  selectedDifficulties.value = []
  selectedDurations.value = []
  selectedRating.value = 'all'
  selectedFormat.value = 'all'
  selectedSort.value = 'popular'
}

function toggleDifficulty(val) {
  const idx = selectedDifficulties.value.indexOf(val)
  if (idx === -1) selectedDifficulties.value.push(val)
  else selectedDifficulties.value.splice(idx, 1)
}

function toggleDuration(val) {
  const idx = selectedDurations.value.indexOf(val)
  if (idx === -1) selectedDurations.value.push(val)
  else selectedDurations.value.splice(idx, 1)
}

function renderStars(rating) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.3
  return { full, hasHalf }
}

function getTeacherName(teacher) {
  if (!teacher) return 'Не указано'
  if (teacher.full_name) return teacher.full_name
  if (teacher.first_name || teacher.last_name) return `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim()
  return teacher.username || 'Неизвестный'
}

function getCourseImageUrl(course) {
  if (course.image && typeof course.image === 'string') {
    return course.image.startsWith('http') ? course.image : `${window.location.origin}${course.image}`
  }
  return null
}

async function enrollCourse(course) {
  if (course.isEnrolled) {
    showWarning('Вы уже записаны на этот курс')
    return
  }
  if (!userRole.currentUser?.value?.id) {
    showError('Для записи на курс необходимо авторизоваться')
    return
  }
  if (!userRole.isStudent?.value) {
    showError('Записываться на курсы могут только студенты')
    return
  }
  try {
    await lmsApi.enrollInCourse(course.id)
    course.isEnrolled = true
    course.students_count = (course.students_count || 0) + 1
    showSuccess(`Вы успешно записались на курс "${course.name}"`)
  } catch (error) {
    const status = error.response?.status
    if (status === 400 || status === 409) {
      showError('Вы уже записаны на этот курс')
      course.isEnrolled = true
    } else if (status === 403) {
      showError('У вас нет прав для записи на этот курс')
    } else {
      showError('Ошибка при записи на курс. Попробуйте позже.')
    }
  }
}

async function checkEnrollmentStatus(coursesData) {
  try {
    const enrolledResponse = await lmsApi.getEnrollments()
    const enrollments = enrolledResponse.data?.results || enrolledResponse.data || []
    const enrolledIds = enrollments
      .map(e => e.subject?.id || e.subject)
      .filter(id => id != null)
    coursesData.forEach(c => { c.isEnrolled = enrolledIds.includes(c.id) })
  } catch {
    coursesData.forEach(c => { c.isEnrolled = false })
  }
}

onMounted(async () => {
  try {
    loading.value = true
    const result = await lmsApi.getCatalogCourses()
    courses.value = result.courses
    categories.value = result.categories
    courseFormats.value = result.formats

    if (userRole.isStudent?.value) {
      await checkEnrollmentStatus(courses.value)
    }
  } catch (error) {
    console.error('Ошибка инициализации каталога:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="catalog-view">
    <!-- Hero -->
    <div class="catalog-hero">
      <h2 class="mb-2">Каталог курсов</h2>
      <p class="text-white-50 mb-3">Выберите курс и начните обучение уже сегодня</p>
      <div class="catalog-search">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <Search :size="18" class="text-muted" />
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control border-start-0"
            placeholder="Поиск по названию, описанию или тегам..."
          />
          <button
            v-if="searchQuery"
            class="btn btn-outline-secondary bg-white border-start-0"
            @click="searchQuery = ''"
          >
            <X :size="16" />
          </button>
        </div>
        <small class="text-white-50 mt-1 d-block">
          Найдено: {{ filteredCourses.length }} из {{ courses.length }} курсов
        </small>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="row g-3 mb-4">
      <div v-for="stat in statsData" :key="stat.label" class="col-6 col-md-3">
        <div class="card stat-card border-0 shadow-sm h-100">
          <div class="card-body p-3 d-flex align-items-center gap-3">
            <div :class="['stat-icon-wrapper', `bg-${stat.color} bg-opacity-10 text-${stat.color}`]">
              <component :is="iconMap[stat.icon]" :size="20" />
            </div>
            <div>
              <div class="stat-label text-muted">{{ stat.label }}</div>
              <div class="stat-value">{{ stat.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category tabs -->
    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
      <ul class="nav filter-tabs flex-nowrap overflow-auto">
        <li v-for="tab in categoryTabs" :key="tab.id" class="nav-item">
          <a
            class="nav-link"
            :class="{ active: selectedCategory === tab.id.toString() || (tab.id === 'all' && selectedCategory === 'all') }"
            href="#"
            @click.prevent="selectedCategory = tab.id === 'all' ? 'all' : tab.id.toString()"
          >
            {{ tab.name }}
            <span class="badge bg-secondary bg-opacity-10 text-secondary ms-1">{{ tab.count }}</span>
          </a>
        </li>
      </ul>

      <button
        class="btn btn-outline-secondary btn-sm d-lg-none"
        @click="showMobileFilters = !showMobileFilters"
      >
        <Filter :size="16" class="me-1" />
        Фильтры
        <span v-if="hasActiveFilters" class="badge bg-primary ms-1">!</span>
      </button>
    </div>

    <div class="row">
      <!-- Sidebar -->
      <div class="col-lg-3 mb-4" :class="{ 'd-none d-lg-block': !showMobileFilters }">
        <div class="card filter-sidebar border-0 shadow-sm">
          <div class="card-header bg-transparent d-flex justify-content-between align-items-center">
            <h6 class="mb-0">
              <Filter :size="16" class="me-1" style="vertical-align: -2px;" />
              Фильтры
            </h6>
            <button
              v-if="hasActiveFilters"
              class="btn btn-link btn-sm text-danger p-0"
              @click="resetFilters"
            >
              Сбросить
            </button>
          </div>
          <div class="card-body">
            <!-- Difficulty -->
            <div class="filter-group">
              <label class="filter-group-title">Уровень сложности</label>
              <div v-for="opt in difficultyOptions" :key="opt.value" class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'diff-' + opt.value"
                  :checked="selectedDifficulties.includes(opt.value)"
                  @change="toggleDifficulty(opt.value)"
                />
                <label class="form-check-label" :for="'diff-' + opt.value">{{ opt.label }}</label>
              </div>
            </div>

            <!-- Duration -->
            <div class="filter-group">
              <label class="filter-group-title">Продолжительность</label>
              <div v-for="opt in durationOptions" :key="opt.value" class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="'dur-' + opt.value"
                  :checked="selectedDurations.includes(opt.value)"
                  @change="toggleDuration(opt.value)"
                />
                <label class="form-check-label" :for="'dur-' + opt.value">{{ opt.label }}</label>
              </div>
            </div>

            <!-- Rating -->
            <div class="filter-group">
              <label class="filter-group-title">Рейтинг</label>
              <div v-for="opt in ratingOptions" :key="opt.value" class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="rating-filter"
                  :id="'rating-' + opt.value"
                  :value="opt.value"
                  v-model="selectedRating"
                />
                <label class="form-check-label d-flex align-items-center gap-1" :for="'rating-' + opt.value">
                  <template v-if="opt.value !== 'all'">
                    <Star :size="14" class="text-warning filled" />
                    {{ opt.label }}
                  </template>
                  <template v-else>{{ opt.label }}</template>
                </label>
              </div>
            </div>

            <!-- Format -->
            <div class="filter-group">
              <label class="filter-group-title">Формат</label>
              <select v-model="selectedFormat" class="form-select form-select-sm">
                <option value="all">Все форматы</option>
                <option
                  v-for="fmt in courseFormats"
                  :key="fmt.id"
                  :value="fmt.id.toString()"
                >{{ fmt.name }}</option>
              </select>
            </div>

            <!-- Sort -->
            <div class="filter-group mb-0">
              <label class="filter-group-title">Сортировка</label>
              <select v-model="selectedSort" class="form-select form-select-sm">
                <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Course grid -->
      <div class="col-lg-9">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-2 text-muted">Загрузка курсов...</p>
        </div>

        <div v-else-if="filteredCourses.length === 0" class="empty-state">
          <BookOpen :size="48" class="text-muted mb-3" />
          <h5 class="text-muted">Курсы не найдены</h5>
          <p class="text-muted mb-3">Попробуйте изменить параметры поиска или фильтры</p>
          <button v-if="hasActiveFilters" class="btn btn-outline-primary btn-sm" @click="resetFilters">
            Сбросить фильтры
          </button>
        </div>

        <div v-else class="row g-3">
          <div v-for="course in filteredCourses" :key="course.id" class="col-md-6 col-xl-4">
            <div class="card course-card h-100 border-0 shadow-sm">
              <!-- Image -->
              <div class="course-image">
                <img
                  v-if="getCourseImageUrl(course)"
                  :src="getCourseImageUrl(course)"
                  alt=""
                />
                <CourseImagePlaceholder v-else height="180px" :text="course.name" />

                <div class="course-badges">
                  <span v-if="course.is_new" class="badge bg-info">Новый</span>
                  <span v-if="course.is_popular" class="badge bg-warning text-dark">Популярный</span>
                </div>

                <div class="course-overlay">
                  <router-link
                    :to="`/lms/course/${course.id}`"
                    class="btn btn-light btn-sm"
                  >
                    Подробнее <ChevronRight :size="14" />
                  </router-link>
                </div>
              </div>

              <div class="card-body d-flex flex-column">
                <!-- Rating + Difficulty -->
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <div class="rating-stars d-flex align-items-center gap-1">
                    <template v-for="i in renderStars(course.rating || 0).full" :key="'s'+i">
                      <Star :size="14" class="text-warning filled" />
                    </template>
                    <StarHalf v-if="renderStars(course.rating || 0).hasHalf" :size="14" class="text-warning" />
                    <span class="rating-number">{{ (course.rating || 0).toFixed(1) }}</span>
                    <span class="text-muted small">({{ course.reviews_count || 0 }})</span>
                  </div>
                  <span
                    v-if="course.difficulty"
                    :class="['badge', 'difficulty-badge', `bg-${difficultyColors[course.difficulty]}-subtle`, `text-${difficultyColors[course.difficulty]}`]"
                  >
                    {{ difficultyLabels[course.difficulty] }}
                  </span>
                </div>

                <!-- Title -->
                <h6 class="card-title course-title mb-1">{{ course.name }}</h6>
                <p class="card-text text-muted small course-summary mb-2">
                  {{ course.summary || course.description }}
                </p>

                <!-- Teacher -->
                <div class="d-flex align-items-center gap-1 mb-2 small text-muted">
                  <User :size="14" />
                  <span>{{ getTeacherName(course.teacher) }}</span>
                </div>

                <!-- Metrics -->
                <div class="course-metrics mb-2">
                  <div class="metric-item">
                    <Clock :size="13" />
                    <span>{{ course.duration_hours || 0 }} ч</span>
                  </div>
                  <div class="metric-item">
                    <BarChart3 :size="13" />
                    <span>{{ course.lessons_count || 0 }} уроков</span>
                  </div>
                  <div class="metric-item">
                    <GraduationCap :size="13" />
                    <span>{{ course.students_count || 0 }}</span>
                  </div>
                </div>

                <!-- Tags -->
                <div v-if="course.tags && course.tags.length" class="course-tags mb-auto">
                  <span
                    v-for="tag in course.tags.slice(0, 3)"
                    :key="tag"
                    class="badge bg-light text-dark border"
                  >{{ tag }}</span>
                </div>
              </div>

              <!-- Footer action -->
              <div class="card-footer bg-transparent border-top">
                <div class="d-grid">
                  <button
                    v-if="userRole.isStudent?.value && !course.isEnrolled"
                    class="btn btn-primary btn-sm"
                    :disabled="!course.is_published"
                    @click="enrollCourse(course)"
                  >
                    Записаться
                  </button>
                  <router-link
                    v-else-if="userRole.isStudent?.value && course.isEnrolled"
                    :to="`/lms/course/${course.id}`"
                    class="btn btn-success btn-sm"
                  >
                    <BookOpen :size="16" class="me-1" />
                    Изучать
                  </router-link>
                  <router-link
                    v-else
                    :to="`/lms/course/${course.id}`"
                    class="btn btn-outline-primary btn-sm"
                  >
                    <BookOpen :size="16" class="me-1" />
                    Подробнее
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
