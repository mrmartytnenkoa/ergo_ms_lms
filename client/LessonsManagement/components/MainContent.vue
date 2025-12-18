<template>
  <div>
    <!-- Загрузка -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border"></div>
      <p class="mt-2">Загрузка уроков...</p>
    </div>

    <!-- Пустое состояние -->
    <div v-else-if="groupedData.length === 0" class="text-center py-5">
      <BookOpen :size="48" class="text-muted mb-3" />
      <h5 class="text-muted">Курсы не найдены</h5>
      <p class="text-muted">Создайте первый курс и добавьте в него темы и уроки</p>
      <button @click="$emit('createCourse')" class="btn btn-primary">
        <Plus :size="18" class="me-2" />
        Создать первый курс
      </button>
    </div>

    <!-- Основной контент -->
    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="mb-0">Курсы</h4>
        <button @click="$emit('createCourse')" class="btn btn-outline-primary">
          <Plus :size="18" class="me-2" />
          Создать курс
        </button>
      </div>
      
      <div v-for="courseGroup in groupedData" :key="courseGroup.course.id" class="course-group mb-5">
        <!-- Заголовок курса -->
        <div class="card">
          <div class="card-header p-0">
            <button 
              class="accordion-button w-100 border-0"
              :class="{ collapsed: !isCourseExpanded(courseGroup.course.id) }"
              type="button" 
              @click="$emit('toggleCourse', courseGroup.course.id)"
            >
              <div class="d-flex justify-content-between align-items-center w-100 me-3">
                <div class="d-flex align-items-center gap-3">
                  <!-- Изображение курса -->
                  <div v-if="courseGroup.course.course_image" class="course-image">
                    <img 
                      :src="courseGroup.course.course_image" 
                      :alt="courseGroup.course.name"
                      class="rounded"
                      style="width: 40px; height: 40px; object-fit: cover;"
                    />
                  </div>
                  <div v-else class="course-image-wrapper" style="width: 40px; height: 40px;">
                    <CourseImagePlaceholder 
                      width="40px" 
                      height="40px" 
                      :text="courseGroup.course.name.charAt(0).toUpperCase()"
                    />
                  </div>
                  
                  <div>
                    <h5 class="mb-0">{{ courseGroup.course.name }}</h5>
                    <div class="d-flex align-items-center gap-2 mt-1">
                      <span class="badge bg-light text-dark">{{ courseGroup.themes.length }} тем</span>
                      <span class="badge bg-primary text-white">{{ courseGroup.totalLessons }} уроков</span>
                      <span class="badge bg-success text-white">{{ getCourseStatsText(courseGroup.course.id) }}</span>
                      <span v-if="!courseGroup.course.is_published" class="badge bg-warning">Черновик</span>
                    </div>
                  </div>
                </div>
                <div class="btn-group" @click.stop>
                  <button @click.stop="$emit('editCourse', courseGroup.course)" class="btn btn-sm btn-outline-primary">
                    <Edit :size="16" />
                  </button>
                  <button @click.stop="$emit('createTheme', courseGroup.course)" class="btn btn-sm btn-outline-success">
                    <Plus :size="16" />
                    Тема
                  </button>

                  <button @click.stop="$emit('deleteCourse', courseGroup.course)" class="btn btn-sm btn-outline-danger">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </button>
          </div>

          <!-- Темы курса - теперь условно отображаемые -->
          <div v-show="isCourseExpanded(courseGroup.course.id)" class="card-body p-0 mt-3">
            <div v-if="courseGroup.themes.length === 0" class="text-center py-4">
              <FolderOpen :size="32" class="text-muted mb-2" />
              <p class="text-muted mb-2">В курсе нет тем</p>
              <button @click="$emit('createTheme', courseGroup.course)" class="btn btn-sm btn-primary">
                Создать первую тему
              </button>
            </div>

            <div v-else class="accordion" :id="`course-accordion-${courseGroup.course.id}`">
              <DraggableList 
                v-model="courseGroup.themes" 
                group="themes"
                :animation="300"
                @change="onThemeChange($event, courseGroup.course.id)"
                :can-drag="(theme) => !isThemeExpanded(theme.id)"
                item-key="id"
                tag="div"
                container-class="theme-sortable"
                handle=".theme-drag-handle"
                :disabled="false"
                ghost-class="sortable-ghost"
                chosen-class="sortable-chosen"
                drag-class="sortable-drag"
              >
                <template #default="{ element: theme }">
                  <div class="accordion-item theme-draggable-item"
                       :data-theme-id="theme.id">
                <h2 class="accordion-header">
                  <button 
                    class="accordion-button"
                    :class="{ collapsed: !isThemeExpanded(theme.id) }"
                    type="button" 
                    @click="$emit('toggleTheme', theme.id)"
                  >
                    <div class="d-flex justify-content-between align-items-center w-100 me-3">
                      <div class="d-flex align-items-center gap-3">
                        <div class="theme-drag-handle d-flex align-items-center" :class="{ disabled: isThemeExpanded(theme.id) }">
                          <GripVertical :size="16" class="text-muted" />
                        </div>
                        <FolderOpen :size="18" />
                        <span class="fw-semibold">{{ theme.name }}</span>
                        <span class="badge bg-primary">{{ theme.lessons.length }} уроков</span>
                        <span class="badge bg-success">{{ getThemeStatsText(theme.id) }}</span>
                        <span v-if="!theme.is_visible" class="badge bg-secondary">Скрыта</span>
                      </div>
                      <div class="btn-group" @click.stop>
                        <button @click.stop="$emit('editTheme', theme)" class="btn btn-sm btn-outline-primary">
                          <Edit :size="14" />
                        </button>
                        <button @click.stop="$emit('createLesson', theme)" class="btn btn-sm btn-outline-success">
                          <Plus :size="14" />
                          Урок
                        </button>
                        <button @click.stop="$emit('createForum', theme)" class="btn btn-sm btn-outline-purple">
                          <MessageSquare :size="14" />
                          Форум
                        </button>
                        <button @click.stop="$emit('deleteTheme', theme)" class="btn btn-sm btn-outline-danger">
                          <Trash2 :size="14" />
                        </button>
                      </div>
                    </div>
                  </button>
                </h2>
                <div 
                  :id="`theme-${theme.id}`" 
                  class="accordion-collapse collapse"
                  :class="{ show: isThemeExpanded(theme.id) }"
                >
                  <div class="accordion-body">
                    <!-- Заголовок секции уроков -->
                    <div class="mb-3">
                      <h6 class="mb-0 d-flex align-items-center gap-2">
                        <BookOpen :size="18" />
                        Уроки
                      </h6>
                    </div>

                    <!-- Уроки темы -->
                    <div v-if="theme.lessons.length === 0" class="text-center py-3">
                      <BookOpen :size="24" class="text-muted mb-2" />
                      <p class="text-muted mb-2">В теме нет уроков</p>
                      <small class="text-muted">Используйте кнопки выше для создания контента</small>
                    </div>

                    <div v-else class="lesson-container">
                      <DraggableList 
                        v-model="theme.lessons" 
                        group="lessons"
                        :animation="300"
                        @change="onLessonChange($event, theme.id)"
                        :can-drag="(lesson) => !isLessonExpanded(lesson.id)"
                        item-key="id"
                        tag="div"
                        container-class="lesson-sortable row"
                        handle=".lesson-drag-handle"
                        :disabled="false"
                        ghost-class="sortable-ghost"
                        chosen-class="sortable-chosen"
                        drag-class="sortable-drag"
                      >
                        <template #default="{ element: lesson }">
                          <div class="col-12 mb-4 lesson-draggable-item" :data-lesson-id="lesson.id">
                            <div class="card lesson-card">
                              <div :class="`lesson-type-indicator lesson-type-${lesson.lessontype}`"></div>
                          
                          <!-- Заголовок урока -->
                          <div class="card-header p-0">
                            <button 
                              class="accordion-button w-100 border-0"
                              :class="{ collapsed: !isLessonExpanded(lesson.id) }"
                              type="button" 
                              @click="$emit('toggleLesson', lesson.id)"
                            >
                              <div class="d-flex justify-content-between align-items-center w-100 me-3">
                                <div class="d-flex align-items-center gap-3">
                                  <div class="lesson-drag-handle d-flex align-items-center" :class="{ disabled: isLessonExpanded(lesson.id) }">
                                    <GripVertical :size="16" class="text-muted" />
                                  </div>
                                  <component :is="getLessonTypeIcon(lesson.lessontype)" :size="20" />
                                  <div>
                                    <h6 class="mb-0">{{ lesson.name }}</h6>
                                    <small class="text-muted">{{ lesson.description || 'Без описания' }}</small>
                                  </div>
                                  <div class="d-flex gap-1">
                                    <span class="badge bg-info small">{{ getLessonStatsText(lesson.id) }}</span>
                                    <span v-if="lesson.is_visible" class="badge bg-success small">Видимый</span>
                                    <span v-else class="badge bg-secondary small">Скрытый</span>
                                    <span v-if="lesson.completion_required" class="badge bg-warning small">Обязательный</span>
                                  </div>
                                </div>
                                
                                <div class="btn-group" @click.stop>
                                  <button @click.stop="$emit('editLesson', lesson)" class="btn btn-sm btn-outline-primary">
                                    <Edit :size="14" />
                                  </button>
                                  <button @click.stop="$emit('createTest', null, lesson)" class="btn btn-sm btn-outline-info">
                                    <FileCheck :size="14" class="me-1" />
                                    Тест
                                  </button>
                                  <button @click.stop="$emit('createAssignment', null, lesson)" class="btn btn-sm btn-outline-warning">
                                    <ClipboardList :size="14" class="me-1" />
                                    Задание
                                  </button>
                                  <button @click.stop="$emit('createResource', lesson)" class="btn btn-sm btn-outline-success">
                                    <Upload :size="14" class="me-1" />
                                    Ресурс
                                  </button>
                                  <button @click.stop="$emit('deleteLesson', lesson)" class="btn btn-sm btn-outline-danger">
                                    <Trash2 :size="14" />
                                  </button>
                                </div>
                              </div>
                            </button>
                          </div>

                          <!-- Содержимое урока - теперь условно отображаемое -->
                          <div v-show="isLessonExpanded(lesson.id)" class="card-body">
                            <!-- Новый компонент для управления элементами урока -->
                            <LessonItems
                              :lesson-id="lesson.id"
                              :items="getLessonItems(lesson.id)"
                              @reorder="handleLessonItemsReorder"
                              @create-test="() => $emit('createTest', null, lesson)"
                              @create-assignment="() => $emit('createAssignment', null, lesson)"
                              @create-resource="() => $emit('createResource', lesson)"
                              @edit-test="$emit('editTest', $event)"
                              @edit-assignment="$emit('editAssignment', $event)"
                              @edit-resource="$emit('editResource', $event)"
                              @delete-test="$emit('deleteTest', $event)"
                              @delete-assignment="$emit('deleteAssignment', $event)"
                              @delete-resource="$emit('deleteResource', $event)"
                              @open-question-management="$emit('openQuestionManagement', $event)"
                              @duplicate-test="$emit('duplicateTest', $event)"
                            />
                          </div>
                            </div>
                          </div>
                        </template>
                      </DraggableList>
                    </div>

                    <!-- Форумы темы -->
                    <div class="mt-4">
                      <h6 class="mb-3 d-flex align-items-center gap-2">
                        <MessageSquare :size="18" />
                        Форумы темы
                      </h6>
                      
                      <div v-if="getForumsByTheme(theme.id).length === 0" class="text-center py-3">
                        <MessageSquare :size="24" class="text-muted mb-2" />
                        <p class="text-muted mb-2">В теме нет форумов</p>
                        <small class="text-muted">Используйте кнопки выше для создания контента</small>
                      </div>

                      <div v-else class="row">
                        <div v-for="forum in getForumsByTheme(theme.id)" :key="forum.id" class="col-md-6 col-lg-4 mb-3">
                          <div class="card h-100 forum-card">
                            <div class="card-body">
                              <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="card-title mb-0">{{ forum.name }}</h6>
                                <div class="btn-group">
                                  <button @click="$emit('editForum', forum)" class="btn btn-sm btn-outline-primary">
                                    <Edit :size="14" />
                                  </button>
                                  <button @click="$emit('deleteForum', forum)" class="btn btn-sm btn-outline-danger">
                                    <Trash2 :size="14" />
                                  </button>
                                </div>
                              </div>
                              
                              <p class="card-text text-muted small mb-2">
                                {{ forum.description || 'Без описания' }}
                              </p>
                              
                              <div class="forum-meta small text-muted mb-2">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                  <MessageSquare :size="12" />
                                  <span>{{ getForumTypeName(forum.forum_type) }}</span>
                                </div>
                              </div>

                              <div class="d-flex gap-1">
                                <span v-if="forum.is_moderated" class="badge bg-info small">Модерируемый</span>
                                <span v-if="forum.allow_anonymous" class="badge bg-warning small">Анонимный</span>
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
              </DraggableList>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Plus, Edit, Trash2, Copy, EyeOff, MoreVertical,
  BookOpen, FolderOpen, Hash, Video, FileText, Link, 
  MessageSquare, Calendar, Award, TestTube,
  FileCheck, ClipboardList, Eye, GripVertical, Upload, Download,
  HelpCircle
} from 'lucide-vue-next'
import DraggableList from '../../components/DraggableList.vue'
import CourseImagePlaceholder from '../../components/CourseImagePlaceholder.vue'
import LessonItems from './LessonItems.vue'
import { apiClient } from '@/js/api/manager'
import { endpoints } from '@/js/api/endpoints'
import { computed } from 'vue'

const props = defineProps({
  loading: Boolean,
  groupedData: Array,
  expandedThemes: Set,
  expandedCourses: Set,
  expandedLessons: Set,
  forums: Array,
  tests: Array,
  assignments: Array,
  resources: Array
})

const emit = defineEmits([
  'createCourse',
  'editCourse', 
  'deleteCourse',
  'createTheme',
  'editTheme',
  'deleteTheme',
  'createLesson',
  'editLesson',
  'deleteLesson',
  'duplicateLesson',
  'toggleLessonVisibility',
  'createTest',
  'editTest',
  'deleteTest',
  'duplicateTest',
  'openQuestionManagement',
  'createAssignment',
  'editAssignment',
  'deleteAssignment',
  'createResource',
  'editResource',
  'deleteResource',
  'createForum',
  'editForum',
  'deleteForum',
  'toggleTheme',
  'toggleCourse',
  'toggleLesson',
  'reorderThemes',
  'reorderLessons',
  'reorderTests',
  'reorderAssignments',
  'reorderLessonItems'
])

const lessonTypes = [
  { value: 'L', label: 'Лекция', icon: FileText },
  { value: 'V', label: 'Видео', icon: Video },
  { value: 'URL', label: 'Ссылка', icon: Link },
  { value: 'F', label: 'Форум', icon: MessageSquare },
  { value: 'A', label: 'Задание', icon: Award },
  { value: 'Q', label: 'Тест', icon: TestTube },
  { value: 'C', label: 'Конференция', icon: Calendar },
  { value: 'FILE', label: 'Файл', icon: FileText }
]

function getLessonTypeIcon(type) {
  const lessonType = lessonTypes.find(t => t.value === type)
  return lessonType ? lessonType.icon : FileText
}

function getLessonTypeName(type) {
  const lessonType = lessonTypes.find(t => t.value === type)
  return lessonType ? lessonType.label : 'Неизвестно'
}

function getForumTypeName(type) {
  const forumTypes = {
    'general': 'Общий',
    'discussion': 'Обсуждение',
    'qa': 'Вопросы и ответы',
    'news': 'Новости',
    'announcement': 'Объявления'
  }
  return forumTypes[type] || 'Неизвестный тип'
}

function getTestTypeLabel(type) {
  const testTypes = {
    'C': 'Закрытые вопросы',
    'O': 'Открытые вопросы',
    'G': 'Игровой формат'
  }
  return testTypes[type] || 'Неизвестный тип'
}

function getPluralForm(count, singular, few, many) {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return many
  }
  
  if (lastDigit === 1) {
    return singular
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return few
  }
  
  return many
}

function isThemeExpanded(themeId) {
  return props.expandedThemes?.has(themeId)
}

function isCourseExpanded(courseId) {
  return props.expandedCourses?.has(courseId)
}

function isLessonExpanded(lessonId) {
  return props.expandedLessons?.has(lessonId)
}

function getForumsByTheme(themeId) {
  return props.forums?.filter(forum => {
    let forumThemeId = forum.theme
    if (typeof forumThemeId === 'object' && forumThemeId?.id) {
      forumThemeId = forumThemeId.id
    }
    return parseInt(forumThemeId) === parseInt(themeId)
  }) || []
}

// Функции для подсчета статистики
function getCourseStatsText(courseId) {
  const courseGroup = props.groupedData.find(group => group.course.id === courseId)
  if (!courseGroup) return '0 материалов'
  
  let totalMaterials = 0
  courseGroup.themes.forEach(theme => {
    // Считаем материалы уроков
    theme.lessons.forEach(lesson => {
      const tests = getLessonTests(lesson.id)
      const assignments = getLessonAssignments(lesson.id)
      const resources = getLessonResources(lesson.id)
      totalMaterials += tests.length + assignments.length + resources.length
    })
    
    // Добавляем форумы темы
    const forums = getForumsByTheme(theme.id)
    totalMaterials += forums.length
  })
  
  return `${totalMaterials} материалов`
}

function getThemeStatsText(themeId) {
  const courseGroup = props.groupedData.find(group => 
    group.themes.some(theme => theme.id === themeId)
  )
  if (!courseGroup) return '0 материалов'
  
  const theme = courseGroup.themes.find(t => t.id === themeId)
  if (!theme) return '0 материалов'
  
  let totalMaterials = 0
  
  // Считаем материалы уроков
  theme.lessons.forEach(lesson => {
    const tests = getLessonTests(lesson.id)
    const assignments = getLessonAssignments(lesson.id)
    const resources = getLessonResources(lesson.id)
    totalMaterials += tests.length + assignments.length + resources.length
  })
  
  // Добавляем форумы темы
  const forums = getForumsByTheme(themeId)
  totalMaterials += forums.length
  
  return `${totalMaterials} материалов`
}

function getLessonStatsText(lessonId) {
  const tests = getLessonTests(lessonId)
  const assignments = getLessonAssignments(lessonId)
  const resources = getLessonResources(lessonId)
  const totalMaterials = tests.length + assignments.length + resources.length
  
  return `${totalMaterials} материалов`
}

async function onThemeChange(evt, courseId) {
  console.log('🔄 Событие изменения порядка тем:', evt)
  
  // Обрабатываем только событие moved (когда элемент перемещен)
  if (!evt.moved) {
    return
  }

  console.log('🔄 Изменение порядка тем:', { 
    courseId, 
    oldIndex: evt.moved.oldIndex, 
    newIndex: evt.moved.newIndex 
  })

  // Получаем курс из groupedData
  const courseGroup = props.groupedData.find(group => group.course.id === courseId)
  if (!courseGroup) {
    console.error('Курс не найден:', courseId)
    return
  }

  // Собираем новый порядок ID тем
  const themeIds = courseGroup.themes.map(theme => theme.id)
  
  console.log('📋 Новый порядок тем:', themeIds)

      try {
      // Отправляем запрос на сервер
      const response = await apiClient.post(endpoints.lms.reorderThemes, {
        subject_id: courseId,
        theme_ids: themeIds
      })

      console.log('✅ Порядок тем успешно обновлен на сервере:', response.data)
      
      // Уведомляем родительский компонент об успешном изменении - он обновит исходные данные
      emit('reorderThemes', { courseId, themeIds, success: true })
      
    } catch (error) {
    console.error('❌ Ошибка при сохранении порядка тем:', error)
    
    // В случае ошибки возвращаем старый порядок
    // Уведомляем родителя, чтобы он обновил данные
    emit('reorderThemes', { courseId, error: true })
    
    // Показываем уведомление об ошибке
    console.error('Не удалось сохранить новый порядок тем. Попробуйте еще раз.')
  }
}

async function onLessonChange(evt, themeId) {
  console.log('🔄 Событие изменения порядка уроков:', evt)
  
  // Обрабатываем только событие moved (когда элемент перемещен)
  if (!evt.moved) {
    return
  }

  console.log('🔄 Изменение порядка уроков:', { 
    themeId, 
    oldIndex: evt.moved.oldIndex, 
    newIndex: evt.moved.newIndex 
  })

  // Находим тему в groupedData
  let theme = null
  for (const courseGroup of props.groupedData) {
    const foundTheme = courseGroup.themes.find(t => t.id === themeId)
    if (foundTheme) {
      theme = foundTheme
      break
    }
  }

  if (!theme) {
    console.error('Тема не найдена:', themeId)
    return
  }

  // Собираем новый порядок ID уроков
  const lessonIds = theme.lessons.map(lesson => lesson.id)
  
  console.log('📋 Новый порядок уроков:', lessonIds)

  try {
    // Отправляем запрос на сервер для изменения порядка уроков
    const response = await apiClient.post(endpoints.lms.reorderLessons(themeId), {
      lesson_ids: lessonIds
    })

    console.log('✅ Порядок уроков успешно обновлен на сервере:', response.data)
    
    // Уведомляем родительский компонент об успешном изменении
    emit('reorderLessons', { themeId, lessonIds, success: true })
    
  } catch (error) {
    console.error('❌ Ошибка при сохранении порядка уроков:', error)
    
    // В случае ошибки возвращаем старый порядок
    // Уведомляем родителя, чтобы он обновил данные
    emit('reorderLessons', { themeId, error: true })
    
    // Показываем уведомление об ошибке
    console.error('Не удалось сохранить новый порядок уроков. Попробуйте еще раз.')
  }
}

// Методы для получения контента урока
function getLessonTests(lessonId) {
  return props.tests?.filter(test => {
    let testLessonId = test.lesson
    if (typeof testLessonId === 'object' && testLessonId?.id) {
      testLessonId = testLessonId.id
    }
    return parseInt(testLessonId) === parseInt(lessonId)
  }) || []
}

function getLessonAssignments(lessonId) {
  return props.assignments?.filter(assignment => {
    let assignmentLessonId = assignment.lesson
    if (typeof assignmentLessonId === 'object' && assignmentLessonId?.id) {
      assignmentLessonId = assignmentLessonId.id
    }
    return parseInt(assignmentLessonId) === parseInt(lessonId)
  }) || []
}

function getLessonResources(lessonId) {
  return props.resources?.filter(resource => {
    let resourceLessonId = resource.lesson
    if (typeof resourceLessonId === 'object' && resourceLessonId?.id) {
      resourceLessonId = resourceLessonId.id
    }
    return parseInt(resourceLessonId) === parseInt(lessonId)
  }) || []
}

// Форматирование даты
function formatDate(dateString) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

// Скачивание ресурса
async function downloadResource(resource) {
  try {
    window.open(`/api/lms/resources/${resource.id}/download/`, '_blank')
  } catch (error) {
    console.error('Ошибка при скачивании ресурса:', error)
  }
}

// Функции onThemeStart и onLessonStart больше не нужны,
// так как проверка выполняется через проп can-drag



// Обработка окончания перетаскивания тестов
async function onTestEnd(evt, lessonId) {
  console.log('🔄 Событие окончания перетаскивания тестов:', evt)
  
  // Проверяем, произошло ли реальное перемещение
  if (evt.oldIndex === evt.newIndex) {
    console.log('🔄 Элемент не был перемещен')
    return
  }

  console.log('🔄 Тест перемещен в уроке:', { 
    lessonId, 
    oldIndex: evt.oldIndex, 
    newIndex: evt.newIndex 
  })

  // Получаем актуальный список тестов урока в новом порядке
  const lessonTests = getLessonTests(lessonId)
  
  // Создаем новый массив с правильным порядком
  const reorderedTests = [...lessonTests]
  const [movedTest] = reorderedTests.splice(evt.oldIndex, 1)
  reorderedTests.splice(evt.newIndex, 0, movedTest)
  
  const testIds = reorderedTests.map(test => test.id)
  
  console.log('📋 Новый порядок тестов:', testIds)

  try {
    // Отправляем запрос на сервер для изменения порядка тестов
    const response = await apiClient.post('lms/tests/reorder_tests/', {
      test_ids: testIds,
      context: { lesson_id: lessonId }
    })

    console.log('✅ Порядок тестов успешно обновлен на сервере:', response.data)
    
    // Уведомляем родительский компонент об успешном изменении
    emit('reorderTests', { lessonId, testIds, success: true })
    
  } catch (error) {
    console.error('❌ Ошибка при сохранении порядка тестов:', error)
    
    // В случае ошибки уведомляем родителя
    emit('reorderTests', { lessonId, error: true })
    
    // Показываем уведомление об ошибке
    console.error('Не удалось сохранить новый порядок тестов. Попробуйте еще раз.')
  }
}

// Обработка окончания перетаскивания заданий
async function onAssignmentEnd(evt, lessonId) {
  console.log('🔄 Событие окончания перетаскивания заданий:', evt)
  
  // Проверяем, произошло ли реальное перемещение
  if (evt.oldIndex === evt.newIndex) {
    console.log('🔄 Элемент не был перемещен')
    return
  }

  console.log('🔄 Задание перемещено в уроке:', { 
    lessonId, 
    oldIndex: evt.oldIndex, 
    newIndex: evt.newIndex 
  })

  // Получаем актуальный список заданий урока в новом порядке
  const lessonAssignments = getLessonAssignments(lessonId)
  
  // Создаем новый массив с правильным порядком
  const reorderedAssignments = [...lessonAssignments]
  const [movedAssignment] = reorderedAssignments.splice(evt.oldIndex, 1)
  reorderedAssignments.splice(evt.newIndex, 0, movedAssignment)
  
  const assignmentIds = reorderedAssignments.map(assignment => assignment.id)
  
  console.log('📋 Новый порядок заданий:', assignmentIds)

  try {
    // Отправляем запрос на сервер для изменения порядка заданий
    const response = await apiClient.post('lms/assignments/reorder_assignments/', {
      assignment_ids: assignmentIds,
      context: { lesson_id: lessonId }
    })

    console.log('✅ Порядок заданий успешно обновлен на сервере:', response.data)
    
    // Уведомляем родительский компонент об успешном изменении
    emit('reorderAssignments', { lessonId, assignmentIds, success: true })
    
  } catch (error) {
    console.error('❌ Ошибка при сохранении порядка заданий:', error)
    
    // В случае ошибки уведомляем родителя
    emit('reorderAssignments', { lessonId, error: true })
    
    // Показываем уведомление об ошибке
    console.error('Не удалось сохранить новый порядок заданий. Попробуйте еще раз.')
  }
}

// Проверка возможности начала перетаскивания теста
function onTestStart(evt) {
  console.log('🔄 Начало перетаскивания теста')
  return true
}

// Проверка возможности начала перетаскивания задания
function onAssignmentStart(evt) {
  console.log('🔄 Начало перетаскивания задания')
  return true
}

// Методы для работы с элементами урока (новая унифицированная система)
function getLessonItems(lessonId) {
  // Собираем все элементы урока в единый массив
  const items = []
  
  // Добавляем тесты
  const tests = getLessonTests(lessonId)
  tests.forEach((test, index) => {
    items.push({
      id: `test_${test.id}`,
      item_type: 'test',
      sort_order: test.sort_order || index,
      content: test,
      display_name: test.title || test.name
    })
  })
  
  // Добавляем задания
  const assignments = getLessonAssignments(lessonId)
  assignments.forEach((assignment, index) => {
    items.push({
      id: `assignment_${assignment.id}`,
      item_type: 'assignment',
      sort_order: assignment.sort_order || index + 1000, // Offset to avoid conflicts
      content: assignment,
      display_name: assignment.title
    })
  })
  
  // Добавляем ресурсы
  const resources = getLessonResources(lessonId)
  resources.forEach((resource, index) => {
    items.push({
      id: `resource_${resource.id}`,
      item_type: 'resource',
      sort_order: resource.sort_order || index + 2000, // Offset to avoid conflicts
      content: resource,
      display_name: resource.name
    })
  })
  
  // Сортируем по sort_order
  return items.sort((a, b) => a.sort_order - b.sort_order)
}

// Обработка изменения порядка элементов урока
async function handleLessonItemsReorder(reorderData) {
  console.log('🔄 Изменение порядка элементов урока в MainContent:', reorderData)
  
  // Просто передаем событие родительскому компоненту
  emit('reorderLessonItems', reorderData)
}


</script>

<style scoped>
/* Кнопки форума - фиолетовые */
.btn-outline-purple {
  color: #6f42c1;
  border-color: #6f42c1;
  background-color: transparent;
}

.btn-outline-purple:hover {
  color: #fff;
  background-color: #6f42c1;
  border-color: #6f42c1;
}

.btn-outline-purple:focus {
  box-shadow: 0 0 0 0.2rem rgba(111, 66, 193, 0.5);
}

.btn-outline-purple:active {
  color: #fff;
  background-color: #5a359a;
  border-color: #533085;
}

.btn-purple {
  color: #fff;
  background-color: #6f42c1;
  border-color: #6f42c1;
}

.btn-purple:hover {
  color: #fff;
  background-color: #5a359a;
  border-color: #533085;
}

.btn-purple:focus {
  color: #fff;
  background-color: #5a359a;
  border-color: #533085;
  box-shadow: 0 0 0 0.2rem rgba(111, 66, 193, 0.5);
}

.btn-purple:active {
  color: #fff;
  background-color: #4e2e7e;
  border-color: #462872;
}

.course-group {
  border-left: 4px solid var(--bs-primary);
  position: relative;
  z-index: auto;
}

.course-image img {
  border: 2px solid #dee2e6;
  transition: transform 0.2s ease;
}

.course-image img:hover {
  transform: scale(1.1);
}

.lesson-card {
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  z-index: 1;
  border: 1px solid #e0e0e0;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.lesson-card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  transform: translateY(-4px);
}

.lesson-card .dropdown-menu {
  position: absolute !important;
  z-index: 10000 !important;
  right: 0;
  left: auto;
  min-width: 160px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.lesson-type-indicator {
  width: 4px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 0 0 0 0.375rem;
}

.lesson-type-L { background-color: #0d6efd; }
.lesson-type-V { background-color: #dc3545; }
.lesson-type-A { background-color: #198754; }
.lesson-type-Q { background-color: #fd7e14; }
.lesson-type-F { background-color: #6f42c1; }
.lesson-type-URL { background-color: #20c997; }
.lesson-type-C { background-color: #ffc107; }
.lesson-type-FILE { background-color: #6c757d; }

/* Стили для форумов - статичные карточки без drag and drop */
.forum-list {
  pointer-events: auto;
  position: relative;
}

.forum-item {
  cursor: default !important;
  user-select: auto;
  position: static !important;
}

.forum-card {
  transition: box-shadow 0.2s, transform 0.2s;
  border: 2px solid #6f42c1 !important;
  border-radius: 0.5rem;
  position: static;
  z-index: auto;
  cursor: default;
  box-shadow: 0 2px 8px rgba(111, 66, 193, 0.15);
}

.forum-card:hover {
  box-shadow: 0 6px 20px rgba(111, 66, 193, 0.25);
  transform: translateY(-2px);
  border-color: #5a359a !important;
}

.forum-empty-state {
  position: static !important;
  cursor: default !important;
  user-select: auto;
  pointer-events: auto;
}

/* Убеждаемся что форумы не реагируют на drag and drop стили */
.forum-item .sortable-ghost,
.forum-item .sortable-chosen,
.forum-item .sortable-drag,
.forum-empty-state .sortable-ghost,
.forum-empty-state .sortable-chosen,
.forum-empty-state .sortable-drag {
  display: none !important;
}

.forum-item:not(.sortable-ghost):not(.sortable-chosen):not(.sortable-drag),
.forum-empty-state:not(.sortable-ghost):not(.sortable-chosen):not(.sortable-drag) {
  opacity: 1 !important;
  transform: none !important;
  cursor: default !important;
}

/* Drag and Drop стили */
.theme-sortable {
  min-height: 20px;
}

.theme-draggable-item {
  cursor: move;
  transition: all 0.15s ease-out;
  will-change: transform;
}

.theme-draggable-item:hover {
  background-color: rgba(13, 110, 253, 0.05);
}

/* Убираем курсор move с внутренностей темы */
.theme-draggable-item .accordion-body {
  cursor: default !important;
}

.theme-draggable-item .accordion-body * {
  cursor: default !important;
}

.theme-draggable-item .accordion-header .accordion-button {
  position: relative;
}

.theme-drag-handle {
  cursor: grab;
  transition: all 0.15s ease-out;
  will-change: transform, color;
}

.theme-drag-handle:hover {
  transform: scale(1.1);
}

.theme-drag-handle:active {
  cursor: grabbing;
}

.theme-draggable-item:hover .theme-drag-handle {
  color: #0d6efd !important;
}

/* Drag and Drop стили для уроков */
.lesson-sortable {
  min-height: 20px;
}

.lesson-draggable-item {
  cursor: move;
  transition: all 0.12s ease-out;
  position: relative;
  will-change: transform;
}

.lesson-draggable-item:hover {
  background-color: rgba(25, 135, 84, 0.05);
  border-radius: 0.375rem;
}

.lesson-draggable-item .lesson-card {
  transition: all 0.12s ease-out;
  will-change: transform, box-shadow;
}

.lesson-draggable-item .lesson-card .card-header .accordion-button {
  position: relative;
}

.lesson-drag-handle {
  cursor: grab;
  transition: all 0.12s ease-out;
  padding: 0.25rem;
  border-radius: 0.25rem;
  will-change: transform, color, background-color;
}

.lesson-drag-handle:hover {
  transform: scale(1.1);
  background-color: rgba(25, 135, 84, 0.1);
}

.lesson-drag-handle:active {
  cursor: grabbing;
}

.lesson-draggable-item:hover .lesson-drag-handle {
  color: #198754 !important;
}

/* Дополнительные стили для плавности drag and drop уроков */
.lesson-sortable .sortable-ghost {
  opacity: 0.4;
  background-color: rgba(25, 135, 84, 0.1) !important;
  border: 2px dashed #198754 !important;
  border-radius: 0.375rem;
  transition: none !important;
}

.lesson-sortable .sortable-chosen {
  transform: scale(1.02) !important;
  box-shadow: 0 8px 25px rgba(25, 135, 84, 0.25) !important;
  z-index: 1000 !important;
  border-radius: 0.375rem;
  transition: none !important;
}

.lesson-sortable .sortable-drag {
  transform: rotate(1deg) scale(1.01) !important;
  opacity: 0.95 !important;
  transition: none !important;
}

/* Drag and Drop стили для тестов */
.test-sortable {
  min-height: 20px;
}

.test-draggable-item {
  cursor: move;
  transition: all 0.12s ease-out;
  position: relative;
  will-change: transform;
}

.test-draggable-item:hover {
  background-color: rgba(13, 202, 240, 0.05);
  border-radius: 0.375rem;
}

.test-drag-handle {
  cursor: grab;
  transition: all 0.12s ease-out;
  padding: 0.25rem;
  border-radius: 0.25rem;
  will-change: transform, color, background-color;
}

.test-drag-handle:hover {
  transform: scale(1.1);
  background-color: rgba(13, 202, 240, 0.1);
  color: #0dcaf0 !important;
}

.test-drag-handle:active {
  cursor: grabbing;
}

.test-sortable .sortable-ghost {
  opacity: 0.4;
  background-color: rgba(13, 202, 240, 0.1) !important;
  border: 2px dashed #0dcaf0 !important;
  border-radius: 0.375rem;
  transition: none !important;
}

.test-sortable .sortable-chosen {
  transform: scale(1.02) !important;
  box-shadow: 0 8px 25px rgba(13, 202, 240, 0.25) !important;
  z-index: 1000 !important;
  border-radius: 0.375rem;
  transition: none !important;
}

.test-sortable .sortable-drag {
  transform: rotate(1deg) scale(1.01) !important;
  opacity: 0.95 !important;
  transition: none !important;
}

/* Drag and Drop стили для заданий */
.assignment-sortable {
  min-height: 20px;
}

.assignment-draggable-item {
  cursor: move;
  transition: all 0.12s ease-out;
  position: relative;
  will-change: transform;
}

.assignment-draggable-item:hover {
  background-color: rgba(255, 193, 7, 0.05);
  border-radius: 0.375rem;
}

.assignment-drag-handle {
  cursor: grab;
  transition: all 0.12s ease-out;
  padding: 0.25rem;
  border-radius: 0.25rem;
  will-change: transform, color, background-color;
}

.assignment-drag-handle:hover {
  transform: scale(1.1);
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107 !important;
}

.assignment-drag-handle:active {
  cursor: grabbing;
}

.assignment-sortable .sortable-ghost {
  opacity: 0.4;
  background-color: rgba(255, 193, 7, 0.1) !important;
  border: 2px dashed #ffc107 !important;
  border-radius: 0.375rem;
  transition: none !important;
}

.assignment-sortable .sortable-chosen {
  transform: scale(1.02) !important;
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.25) !important;
  z-index: 1000 !important;
  border-radius: 0.375rem;
  transition: none !important;
}

.assignment-sortable .sortable-drag {
  transform: rotate(1deg) scale(1.01) !important;
  opacity: 0.95 !important;
  transition: none !important;
}

/* Стили для состояния перетаскивания тем */
.theme-sortable .sortable-ghost {
  opacity: 0.4;
  background-color: rgba(13, 110, 253, 0.1) !important;
  border: 2px dashed #0d6efd !important;
  border-radius: 0.375rem;
  transition: none !important;
}

.theme-sortable .sortable-chosen {
  transform: scale(1.01) !important;
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.2) !important;
  z-index: 1000 !important;
  transition: none !important;
}

.theme-sortable .sortable-drag {
  transform: rotate(1deg) scale(1.005) !important;
  opacity: 0.95 !important;
  transition: none !important;
}

.badge.small {
  font-size: 0.6rem;
}

.accordion-item {
  border: 1px solid rgba(0, 0, 0, 0.125);
  margin-bottom: 0.5rem;
  border-radius: 0.375rem;
  overflow: visible;
}

.accordion-button {
  font-weight: 500;
  padding: 1rem 1.25rem;
}

.accordion-button:not(.collapsed) {
  background-color: rgba(var(--bs-primary-rgb), 0.08);
  border-color: rgba(var(--bs-primary-rgb), 0.125);
}

/* Стили для аккордеонов курсов */
.course-group .card-header .accordion-button {
  background-color: #f8f9fa;
  border: none;
  font-weight: 500;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
}

.course-group .card-header .accordion-button:not(.collapsed) {
  background-color: rgba(var(--bs-primary-rgb), 0.08);
  color: var(--bs-primary);
}

.course-group .card-header .accordion-button:focus {
  box-shadow: none;
  border-color: transparent;
}

.course-group .card-body {
  padding-top: 1.5rem !important;
  background-color: #fafbfc;
  border-top: 2px solid #e9ecef;
}

/* Стили для аккордеонов уроков */
.lesson-card .card-header .accordion-button {
  background-color: #fff;
  border: none;
  font-weight: 500;
  padding: 0.75rem 1rem;
  cursor: pointer !important;
}

.lesson-card .card-header .accordion-button:not(.collapsed) {
  background-color: rgba(var(--bs-success-rgb), 0.08);
  color: var(--bs-success);
}

.lesson-card .card-header .accordion-button:focus {
  box-shadow: none;
  border-color: transparent;
}

.lesson-card .card-header .accordion-button:hover {
  background-color: rgba(var(--bs-success-rgb), 0.05);
  cursor: pointer !important;
}

/* Убеждаемся что все элементы внутри кнопки урока имеют cursor pointer */
.lesson-card .card-header .accordion-button * {
  cursor: pointer !important;
}

/* Исключение для кнопок управления уроком */
.lesson-card .card-header .btn-group,
.lesson-card .card-header .btn-group * {
  cursor: default !important;
}

/* Исключение для drag handle урока - оставляем grab cursor */
.lesson-card .card-header .lesson-drag-handle,
.lesson-card .card-header .lesson-drag-handle * {
  cursor: grab !important;
}

.lesson-card .card-header .lesson-drag-handle:active,
.lesson-card .card-header .lesson-drag-handle:active * {
  cursor: grabbing !important;
}

.accordion-body {
  padding: 1rem 1.25rem;
  background-color: #fff;
  overflow: visible;
}

/* Стили для карточек тестов, заданий и ресурсов */
.card.border-info {
  border-left: 4px solid #0dcaf0 !important;
  transition: all 0.2s ease;
  border-top: 1px solid #e9ecef;
  border-right: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}

.card.border-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 202, 240, 0.15);
}

.card.border-warning {
  border-left: 4px solid #ffc107 !important;
  transition: all 0.2s ease;
  border-top: 1px solid #e9ecef;
  border-right: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}

.card.border-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.15);
}

.card.border-success {
  border-left: 4px solid #198754 !important;
  transition: all 0.2s ease;
  border-top: 1px solid #e9ecef;
  border-right: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
}

.card.border-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.15);
}

/* Стили для заголовков разделов в уроке */
.lesson-card .card-body h6 {
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
  margin-bottom: 15px;
}

/* Стили для пустых состояний */
.bg-light.rounded {
  background-color: #f8f9fa !important;
  border: 2px dashed #dee2e6;
  padding: 20px;
  margin: 10px 0;
  transition: all 0.2s ease;
}

.bg-light.rounded:hover {
  background-color: #e9ecef !important;
  border-color: #6c757d;
}

/* Улучшение отступов для содержимого урока */
.lesson-card .card-body > div:not(:last-child) {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f1f3f4;
}

/* Стили для значков в карточках */
.badge.small {
  font-size: 0.65em;
  padding: 0.25em 0.5em;
  font-weight: 500;
}

/* Анимация для dropdown меню */
.dropdown-menu {
  animation: fadeIn 0.15s ease-in-out;
  border: 1px solid rgba(0, 0, 0, 0.125);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Стили для курсора кнопок */
.btn {
  cursor: pointer !important;
}

.btn:hover {
  cursor: pointer !important;
}

.btn:disabled {
  cursor: not-allowed !important;
}

/* Группы кнопок */
.btn-group .btn {
  cursor: pointer !important;
}

.btn-group .btn:hover {
  cursor: pointer !important;
}

.btn-group .btn:disabled {
  cursor: not-allowed !important;
}

/* Кнопки в карточках курсов, тем и уроков */
.course-group .btn,
.accordion-item .btn,
.lesson-card .btn,
.card .btn {
  cursor: pointer !important;
}

.course-group .btn:hover,
.accordion-item .btn:hover,
.lesson-card .btn:hover,
.card .btn:hover {
  cursor: pointer !important;
}

.course-group .btn:disabled,
.accordion-item .btn:disabled,
.lesson-card .btn:disabled,
.card .btn:disabled {
  cursor: not-allowed !important;
}

/* Убеждаемся что иконки внутри кнопок тоже имеют правильный курсор */
.btn svg,
.btn i {
  cursor: pointer !important;
  pointer-events: none; /* Предотвращаем захват событий иконками */
}

/* Стили для стрелочек accordion-button */
.accordion-button::after {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-left: auto;
  content: "";
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-size: 1.25rem;
  transition: transform 0.2s ease-in-out;
}

.accordion-button:not(.collapsed)::after {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
  transform: rotate(-180deg);
}

.accordion-button:focus {
  z-index: 3;
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.accordion-button:not(.collapsed) {
  color: #0c63e4;
  background-color: #e7f1ff;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.125);
}

/* Стили для отключенного drag & drop */
.theme-drag-handle.disabled,
.lesson-drag-handle.disabled {
  opacity: 0.3 !important;
  cursor: not-allowed !important;
  pointer-events: none !important;
  background-color: transparent !important;
}

.theme-drag-handle.disabled:hover,
.lesson-drag-handle.disabled:hover {
  color: #6c757d !important;
  cursor: not-allowed !important;
  transform: none !important;
  background-color: transparent !important;
}

/* Центрирование иконок в кнопках */
.btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.25rem !important;
}

.btn svg {
  display: inline-block !important;
  vertical-align: middle !important;
  flex-shrink: 0 !important;
}

/* Для кнопок в группах */
.btn-group .btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.25rem !important;
}

.btn-group .btn svg {
  display: inline-block !important;
  vertical-align: middle !important;
  flex-shrink: 0 !important;
}

/* Центрирование для кнопок аккордеона */
.accordion-button {
  display: flex !important;
  align-items: center !important;
}

.accordion-button .d-flex {
  display: flex !important;
  align-items: center !important;
}

.accordion-button svg {
  display: inline-block !important;
  vertical-align: middle !important;
  flex-shrink: 0 !important;
}

/* Центрирование для всех svg иконок */
svg {
  display: inline-block !important;
  vertical-align: middle !important;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .lesson-card .card-header .btn-group {
    flex-direction: column;
    width: 100%;
  }
  
  .lesson-card .card-header .btn-group .btn {
    margin-bottom: 0.25rem;
    border-radius: 0.375rem !important;
  }
}
</style> 