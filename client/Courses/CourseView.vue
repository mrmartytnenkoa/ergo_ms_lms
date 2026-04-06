<template>
  <div class="course-view">
    <!-- Загрузка -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка курса...</span>
      </div>
      <p class="mt-3 text-muted">Загрузка информации о курсе...</p>
    </div>

    <template v-else-if="course">
      <!-- Заголовок курса -->
      <div class="course-header mb-4">
        <div class="row">
          <div class="col-lg-8">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link to="/lms/courses">Мои курсы</router-link>
                </li>
                <li class="breadcrumb-item active">{{ course.name }}</li>
              </ol>
            </nav>
            
            <h2 class="mb-3">{{ course.name }}</h2>
            <p class="lead text-muted mb-3">{{ course.summary || course.description }}</p>
            
            <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
              <div class="d-flex align-items-center">
                <User :size="16" class="me-2 text-muted" />
                <span>{{ course.teacher?.first_name }} {{ course.teacher?.last_name }}</span>
              </div>
              
              <div v-if="course.category" class="d-flex align-items-center">
                <Tag :size="16" class="me-2 text-muted" />
                <span class="badge bg-light text-dark">{{ course.category.name }}</span>
              </div>
              
              <div v-if="userRole.isStudent?.value && enrollmentInfo" class="d-flex align-items-center">
                <Calendar :size="16" class="me-2 text-muted" />
                <span>Записан {{ formatDate(enrollmentInfo.enrollment_date) }}</span>
              </div>
            </div>
            
            <!-- Прогресс (только для студентов) -->
            <div v-if="userRole.isStudent?.value && enrollmentInfo" class="progress-section mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted">Прогресс курса</span>
                <span class="fw-bold">{{ enrollmentInfo.progress_percentage || 0 }}%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div 
                  class="progress-bar bg-success" 
                  :style="`width: ${enrollmentInfo.progress_percentage || 0}%`"
                ></div>
              </div>
            </div>
            
            <!-- Уведомление для преподавателей и администраторов -->
            <div v-if="userRole.isTeacher?.value || userRole.isAdmin?.value" class="alert alert-info mb-3">
              <div class="d-flex align-items-center">
                <User :size="16" class="me-2" />
                <span>
                  <strong>Режим просмотра:</strong> 
                  Вы просматриваете курс как {{ userRole.isAdmin?.value ? 'администратор' : 'преподаватель' }}. 
                  Интерактивные элементы недоступны.
                </span>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4">
            <div class="course-info-card">
              <div class="card">
                <div class="card-body">
                  <h6 class="card-title">Информация о курсе</h6>
                  
                  <div class="course-stats">
                    <div class="stat-item d-flex justify-content-between mb-2">
                      <span class="text-muted">Тем:</span>
                      <span class="fw-bold">{{ structure.length }}</span>
                    </div>
                    <div class="stat-item d-flex justify-content-between mb-2">
                      <span class="text-muted">Уроков:</span>
                      <span class="fw-bold">{{ totalLessons }}</span>
                    </div>
                    <div class="stat-item d-flex justify-content-between mb-2">
                      <span class="text-muted">Тестов:</span>
                      <span class="fw-bold">{{ totalTests }}</span>
                    </div>
                    <div class="stat-item d-flex justify-content-between">
                      <span class="text-muted">Заданий:</span>
                      <span class="fw-bold">{{ totalAssignments }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Структура курса -->
      <div class="course-structure">
        <div v-if="structure.length === 0" class="text-center py-5">
          <BookOpen :size="48" class="text-muted mb-3" />
          <h5 class="text-muted">Курс в разработке</h5>
          <p class="text-muted">Преподаватель ещё не добавил содержание курса</p>
        </div>

        <div v-else>
          <div v-for="(theme, themeIndex) in structure" :key="theme.id" class="theme-section mb-4">
            <div class="theme-header">
              <div class="card">
                <div class="card-header bg-primary text-white">
                  <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                      <span class="theme-number">{{ themeIndex + 1 }}.</span>
                      {{ theme.name }}
                    </h5>
                    <div v-if="userRole.isStudent?.value" class="theme-progress">
                      <span class="badge bg-light text-dark">
                        {{ getThemeProgress(theme) }}% завершено
                      </span>
                    </div>
                  </div>
                  <p v-if="theme.description" class="mt-2 mb-0 small opacity-75">
                    {{ theme.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Уроки темы -->
            <div class="lessons-list">
              <div 
                v-for="(lesson, lessonIndex) in theme.lessons" 
                :key="lesson.id"
                class="lesson-item"
              >
                <div class="card lesson-card">
                  <div 
                    class="card-body"
                    :class="{ 'cursor-pointer': canAccessLesson(lesson) }"
                    @click="openLesson(lesson)"
                  >
                    <div class="d-flex align-items-center">
                      <div class="lesson-icon me-3">
                        <component 
                          :is="getLessonIcon(lesson.lessontype)" 
                          :size="20"
                          :class="getLessonIconClass(lesson)"
                        />
                      </div>
                      
                      <div class="flex-grow-1">
                        <h6 class="mb-1">
                          {{ themeIndex + 1 }}.{{ lessonIndex + 1 }} {{ lesson.name }}
                        </h6>
                        <p class="text-muted small mb-2">{{ lesson.description }}</p>
                        
                        <!-- Элементы урока -->
                        <div v-if="lesson.items && lesson.items.length > 0" class="lesson-items">
                          <div class="d-flex flex-wrap gap-2">
                            <span 
                              v-for="item in lesson.items" 
                              :key="item.id"
                              :class="`badge bg-${getItemTypeColor(item.item_type)}-subtle text-${getItemTypeColor(item.item_type)}`"
                            >
                              <component :is="getItemIcon(item.item_type)" :size="12" class="me-1" />
                              {{ getItemTypeName(item.item_type) }}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="lesson-status">
                        <!-- Статус для студентов -->
                        <template v-if="userRole.isStudent?.value">
                          <CheckCircle 
                            v-if="isLessonCompleted(lesson)"
                            :size="20" 
                            class="text-success"
                          />
                          <Circle 
                            v-else-if="canAccessLesson(lesson)"
                            :size="20" 
                            class="text-muted"
                          />
                          <Lock 
                            v-else
                            :size="20" 
                            class="text-muted"
                          />
                        </template>
                        <!-- Статус для преподавателей и администраторов -->
                        <template v-else-if="userRole.isTeacher?.value || userRole.isAdmin?.value">
                          <BookOpen 
                            :size="20" 
                            class="text-primary"
                            title="Режим просмотра"
                          />
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Ошибка загрузки -->
    <div v-else class="text-center py-5">
      <AlertCircle :size="48" class="text-danger mb-3" />
      <h5 class="text-danger">Ошибка загрузки курса</h5>
      <p class="text-muted">Курс не найден или у вас нет доступа к нему</p>
      <router-link to="/lms/catalog" class="btn btn-primary">
        Вернуться к каталогу
      </router-link>
    </div>
    
    <!-- Модальное окно урока -->
    <LessonModal 
      v-if="selectedLesson"
      :lesson="selectedLesson"
      :course="course"
      :isReadOnly="!userRole.isStudent?.value"
      @close="closeLessonModal"
      @completed="onLessonCompleted"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  BookOpen, User, Tag, Calendar, CheckCircle, Circle, Lock, 
  Video, FileText, MessageCircle, HelpCircle, FileCheck,
  AlertCircle, File, Link as LinkIcon, Award
} from 'lucide-vue-next'
import { apiClient } from '@/js/api/manager'
import { endpoints } from '@/js/api/endpoints'
import { lmsApi } from '../js/lmsApi'
import { globalUserRole } from '../composables/useUserRole'
import LessonModal from '../components/LessonModal.vue'

const route = useRoute()
const courseId = route.params.id
const userRole = globalUserRole

const course = ref(null)
const structure = ref([])
const enrollmentInfo = ref(null)
const selectedLesson = ref(null)
const loading = ref(true)
const completedLessons = ref(new Set())

// Вычисляемые свойства
const totalLessons = computed(() => {
  return structure.value.reduce((total, theme) => total + (theme.lessons?.length || 0), 0)
})

const totalTests = computed(() => {
  return structure.value.reduce((total, theme) => {
    return total + (theme.lessons?.reduce((lessonTotal, lesson) => {
      return lessonTotal + (lesson.items?.filter(item => item.item_type === 'test').length || 0)
    }, 0) || 0)
  }, 0)
})

const totalAssignments = computed(() => {
  return structure.value.reduce((total, theme) => {
    return total + (theme.lessons?.reduce((lessonTotal, lesson) => {
      return lessonTotal + (lesson.items?.filter(item => item.item_type === 'assignment').length || 0)
    }, 0) || 0)
  }, 0)
})

async function loadCourse() {
  try {
    loading.value = true

    let structureData = null
    let usedMock = false

    try {
      const res = await apiClient.get(endpoints.lms.subjectStructure(courseId))
      if (res.success) structureData = res.data
    } catch {
      // fallback to mock
    }

    if (!structureData) {
      structureData = lmsApi.getCourseStructureMock(courseId).data
      usedMock = true
    }

    course.value = structureData.course
    structure.value = structureData.structure || []

    // Элементы уроков уже встроены в mock-структуру, запрашиваем только для реального API
    if (!usedMock) await loadLessonItems()

    await loadEnrollmentInfo()
    loadCompletedLessons()

  } catch (error) {
    console.error('Ошибка загрузки курса:', error)
    course.value = null
  } finally {
    loading.value = false
  }
}

// Загрузка элементов уроков
async function loadLessonItems() {
  try {
      for (const theme of structure.value) {
      for (const lesson of theme.lessons || []) {
        try {
          const itemsResponse = await lmsApi.getLessonItems(lesson.id)
          lesson.items = itemsResponse.data.results || itemsResponse.data || []
        } catch (error) {
          console.warn(`Не удалось загрузить элементы урока ${lesson.id}:`, error)
          lesson.items = []
        }
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки элементов уроков:', error)
  }
}

// Загрузка информации о записи
async function loadEnrollmentInfo() {
  if (!userRole.isStudent?.value) return
  
  try {
    const enrollmentResponse = await apiClient.get(endpoints.lms.enrollments, {
      params: { subject: courseId }
    })
    if (enrollmentResponse.success) {
      const enrollments = enrollmentResponse.data.results || enrollmentResponse.data || []
      enrollmentInfo.value = enrollments.find(e => e.subject === parseInt(courseId))
    }
  } catch (error) {
    console.warn('Не удалось загрузить информацию о записи:', error)
  }
}

// Загрузка завершенных уроков из localStorage
function loadCompletedLessons() {
  if (!userRole.isStudent?.value) return
  
  try {
    for (const theme of structure.value) {
      for (const lesson of theme.lessons || []) {
        const storageKey = `lesson_progress_${courseId}_${lesson.id}`
        const savedProgress = localStorage.getItem(storageKey)
        
        if (savedProgress) {
          try {
            const progressData = JSON.parse(savedProgress)
            if (progressData.completed) {
              completedLessons.value.add(lesson.id)
            }
          } catch (error) {
            console.warn(`Ошибка загрузки прогресса урока ${lesson.id}:`, error)
          }
        }
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки завершенных уроков:', error)
  }
}

// Функции для работы с уроками
function getLessonIcon(lessonType) {
  switch (lessonType) {
    case 'V': return Video
    case 'C': return MessageCircle
    case 'L': return FileText
    case 'A': return FileCheck
    case 'Q': return HelpCircle
    case 'F': return MessageCircle
    case 'FILE': return File
    case 'URL': return LinkIcon
    default: return BookOpen
  }
}

function getLessonIconClass(lesson) {
  if (isLessonCompleted(lesson)) return 'text-success'
  if (canAccessLesson(lesson)) return 'text-primary'
  return 'text-muted'
}

function getItemIcon(itemType) {
  switch (itemType) {
    case 'test': return HelpCircle
    case 'assignment': return FileCheck
    case 'resource': return File
    default: return BookOpen
  }
}

function getItemTypeColor(itemType) {
  switch (itemType) {
    case 'test': return 'info'
    case 'assignment': return 'warning'
    case 'resource': return 'secondary'
    default: return 'primary'
  }
}

function getItemTypeName(itemType) {
  switch (itemType) {
    case 'test': return 'Тест'
    case 'assignment': return 'Задание'
    case 'resource': return 'Ресурс'
    default: return 'Элемент'
  }
}

function canAccessLesson(lesson) {
  // Студенты, преподаватели и администраторы могут просматривать уроки
  if (userRole.isStudent?.value || userRole.isTeacher?.value || userRole.isAdmin?.value) {
    return true
  }
  
  // Неавторизованные пользователи не могут открывать уроки
  return false
}

function isLessonCompleted(lesson) {
  // Проверяем локально завершенные уроки
  if (completedLessons.value.has(lesson.id)) {
    return true
  }
  
  // Проверяем в localStorage
  const storageKey = `lesson_progress_${courseId}_${lesson.id}`
  const savedProgress = localStorage.getItem(storageKey)
  
  if (savedProgress) {
    try {
      const progressData = JSON.parse(savedProgress)
      if (progressData.completed) {
        completedLessons.value.add(lesson.id)
        return true
      }
    } catch (error) {
      console.warn('Ошибка проверки прогресса урока:', error)
    }
  }
  
  return false
}

function getThemeProgress(theme) {
  if (!theme.lessons || theme.lessons.length === 0) return 0
  
  const completedCount = theme.lessons.filter(lesson => isLessonCompleted(lesson)).length
  return Math.round((completedCount / theme.lessons.length) * 100)
}

function openLesson(lesson) {
  if (canAccessLesson(lesson)) {
    selectedLesson.value = lesson
  }
}

function closeLessonModal() {
  selectedLesson.value = null
}

function onLessonCompleted(lessonId) {
  if (!userRole.isStudent?.value) return
  
  completedLessons.value.add(lessonId)
  closeLessonModal()
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadCourse()
})
</script>

<style lang="scss" scoped>
.course-view {
  .course-header {
    .progress {
      border-radius: 10px;
      
      .progress-bar {
        border-radius: 10px;
      }
    }
  }
  
  .course-info-card {
    .card {
      border: none;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  }
  
  .theme-section {
    margin-bottom: 2rem;
    
    .theme-header {
      margin-bottom: 1rem;
      z-index: 10;
      position: relative;
      
      .card {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .card-header {
        border-radius: 0.5rem !important;
      }
      
      .theme-number {
        font-weight: 600;
        margin-right: 0.5rem;
      }
    }
    
    .lessons-list {
      margin-top: 1rem;
      padding-left: 1rem;
      position: relative;
      
      // Добавляем линию слева для визуальной связи
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--bs-border-color);
        opacity: 0.3;
      }
    }
  }
  
  .lesson-card {
    border: none;
    border-left: 4px solid var(--bs-primary);
    transition: all 0.2s ease;
    margin-left: 1rem;
    margin-bottom: 0.75rem;
    background: white;
    position: relative;
    z-index: 5;
    
    &:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      z-index: 15;
    }
    
    .cursor-pointer {
      cursor: pointer;
    }
  }
  
  .lesson-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bs-light);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .lesson-items {
    .badge {
      font-size: 0.7rem;
    }
  }
}

// Отзывчивый дизайн
@media (max-width: 768px) {
  .course-view {
    .lesson-card {
      margin-left: 0.5rem;
      
      &:hover {
        transform: translateX(2px);
      }
    }
    
    .theme-section {
      .lessons-list {
        padding-left: 0.5rem;
      }
    }
    
    .course-header {
      .row {
        .col-lg-4 {
          margin-top: 1rem;
        }
      }
    }
  }
}
</style> 