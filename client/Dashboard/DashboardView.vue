<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  BookOpen, FileCheck, Award, Clock, TrendingUp, Users, Star,
  GraduationCap, ClipboardCheck, Play, Calendar, MapPin, Bell, Flame, Rocket, Globe,
  Timer, ChevronRight, Search, Layout, Activity, Library, Shield,
  PenTool, Target, Zap
} from 'lucide-vue-next'
import { useUserRole } from '../composables/useUserRole'
import { useUtils } from '../composables/useUtils'
import { useRouter } from 'vue-router'
import { lmsApi } from '../js/lmsApi'

const userRole = useUserRole()
const { formatRelativeTime } = useUtils()
const router = useRouter()

const loading = ref(true)
const dashboardData = ref({
  stats: {},
  recentCourses: [],
  upcomingEvents: [],
  notifications: [],
  achievements: [],
  weeklyActivity: []
})

const iconMap = {
  BookOpen, FileCheck, Award, Clock, Users, GraduationCap,
  ClipboardCheck, Activity, Star, Flame, Rocket, Globe,
  Timer, TrendingUp, Library, Shield, PenTool, Target
}

function resolveIcon(name) {
  return iconMap[name] || Star
}

const eventTypeConfig = {
  test: { label: 'Тест', class: 'bg-danger' },
  webinar: { label: 'Вебинар', class: 'bg-info' },
  deadline: { label: 'Дедлайн', class: 'bg-warning text-dark' },
  lecture: { label: 'Лекция', class: 'bg-primary' },
  practice: { label: 'Практика', class: 'bg-success' },
  meeting: { label: 'Совещание', class: 'bg-secondary' },
  system: { label: 'Система', class: 'bg-dark' },
  launch: { label: 'Запуск', class: 'bg-success' }
}

const notificationIconMap = {
  grading: { icon: ClipboardCheck, color: 'text-success' },
  assignment: { icon: FileCheck, color: 'text-primary' },
  badge: { icon: Award, color: 'text-warning' },
  enrollment: { icon: BookOpen, color: 'text-info' },
  info: { icon: Bell, color: 'text-secondary' },
  success: { icon: Zap, color: 'text-success' },
  warning: { icon: Bell, color: 'text-warning' },
  error: { icon: Bell, color: 'text-danger' }
}

function getEventConfig(type) {
  return eventTypeConfig[type] || { label: type, class: 'bg-secondary' }
}

function getNotificationConfig(type) {
  return notificationIconMap[type] || { icon: Bell, color: 'text-secondary' }
}

function getProgressColor(progress) {
  if (progress >= 80) return 'bg-success'
  if (progress >= 50) return 'bg-primary'
  if (progress >= 25) return 'bg-warning'
  return 'bg-danger'
}

function formatEventDate(dateStr) {
  const d = new Date(dateStr)
  return { day: d.getDate(), month: d.toLocaleDateString('ru-RU', { month: 'short' }) }
}

function formatEventTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const maxWeeklyHours = computed(() => {
  if (!dashboardData.value.weeklyActivity?.length) return 1
  return Math.max(...dashboardData.value.weeklyActivity.map(d => d.hours), 1)
})

const totalWeeklyHours = computed(() => {
  if (!dashboardData.value.weeklyActivity?.length) return 0
  return dashboardData.value.weeklyActivity.reduce((sum, d) => sum + d.hours, 0)
})

const displayedRecentCourses = computed(() => {
  return (dashboardData.value.recentCourses || []).slice(0, 3)
})

const displayedNotifications = computed(() => {
  return (dashboardData.value.notifications || []).slice(0, 5)
})

const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  let greeting = 'Добрый день'
  if (hour < 6) greeting = 'Доброй ночи'
  else if (hour < 12) greeting = 'Доброе утро'
  else if (hour >= 18) greeting = 'Добрый вечер'

  const name = userRole.currentUser.value?.user?.first_name || ''
  return name ? `${greeting}, ${name}!` : `${greeting}!`
})

const roleSubtitle = computed(() => {
  const role = userRole.getRoleDisplayName(userRole.primaryRole.value)
  return role ? `Панель: ${role}` : ''
})

const quickActions = computed(() => {
  const role = userRole.primaryRole.value
  if (role === 'teacher') {
    return [
      { icon: BookOpen, label: 'Мои курсы', route: 'LMSCourses', color: 'primary' },
      { icon: ClipboardCheck, label: 'Проверка работ', route: 'LMSGrades', color: 'warning' },
      { icon: Calendar, label: 'Расписание', route: 'LMSCalendar', color: 'info' },
      { icon: Users, label: 'Студенты', route: 'LMSGrades', color: 'success' }
    ]
  }
  if (role === 'admin') {
    return [
      { icon: Layout, label: 'Управление курсами', route: 'LMSLessonsManagement', color: 'primary' },
      { icon: Users, label: 'Пользователи', route: 'LMSStudentManagement', color: 'success' },
      { icon: Activity, label: 'Аналитика', route: 'LMSCareerAnalytics', color: 'info' },
      { icon: Target, label: 'Отчеты', route: 'LMSReports', color: 'warning' }
    ]
  }
  return [
    { icon: Search, label: 'Каталог курсов', route: 'LMSCatalog', color: 'primary' },
    { icon: FileCheck, label: 'Мои тесты', route: 'LMSTests', color: 'success' },
    { icon: Calendar, label: 'Расписание', route: 'LMSCalendar', color: 'info' },
    { icon: Award, label: 'Мои оценки', route: 'LMSGrades', color: 'warning' }
  ]
})

async function loadDashboardData() {
  loading.value = true
  try {
    const role = userRole.primaryRole.value || 'student'
    const response = await lmsApi.getDashboardData(role)
    if (response?.data) {
      dashboardData.value = response.data
    }
  } catch (error) {
    console.error('Dashboard load error:', error)
  } finally {
    loading.value = false
  }
}

function goToCourse(course) {
  router.push({ name: 'LMSCourseView', params: { id: course.id } })
}

function goToRoute(routeName) {
  router.push({ name: routeName })
}

watch(
  () => userRole.primaryRole.value,
  (newRole, oldRole) => {
    if (newRole && newRole !== oldRole) loadDashboardData()
  },
  { immediate: false }
)

onMounted(() => loadDashboardData())
</script>

<template>
  <div class="dashboard-view">
    <!-- Приветствие и быстрые действия -->
    <div class="row mb-4 align-items-center">
      <div class="col-lg-8">
        <h3 class="fw-bold mb-1">{{ welcomeMessage }}</h3>
        <p class="text-muted mb-0">{{ roleSubtitle }}</p>
      </div>
      <div class="col-lg-4 text-lg-end mt-3 mt-lg-0">
        <div class="d-flex gap-2 justify-content-lg-end flex-wrap">
          <button
            v-for="action in quickActions"
            :key="action.label"
            class="btn btn-sm quick-action-btn"
            :class="`btn-outline-${action.color}`"
            @click="goToRoute(action.route)"
          >
            <component :is="action.icon" :size="14" class="me-1 align-middle" />
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <p class="mt-3 text-muted">Загрузка данных дашборда...</p>
    </div>

    <template v-else>
      <div class="row g-3">
        <!-- Текущие курсы -->
        <div class="col-lg-8 mb-3">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent d-flex align-items-center justify-content-between py-3">
              <div class="d-flex align-items-center gap-2">
                <BookOpen :size="18" class="text-primary" />
                <h6 class="mb-0 fw-semibold">Текущие курсы</h6>
              </div>
              <button class="btn btn-sm btn-link text-decoration-none p-0" @click="goToRoute('LMSCourses')">
                Все курсы <ChevronRight :size="14" class="align-middle" />
              </button>
            </div>
            <div class="card-body p-0">
              <div v-if="!displayedRecentCourses.length" class="text-center py-5 text-muted">
                <BookOpen :size="40" class="mb-2 opacity-50" />
                <p class="mb-1">Нет активных курсов</p>
                <small>Запишитесь на курсы в каталоге</small>
              </div>
              <div v-else class="course-list">
                <div
                  v-for="course in displayedRecentCourses"
                  :key="course.id"
                  class="course-item d-flex align-items-center gap-3 px-3 py-3"
                  @click="goToCourse(course)"
                  role="button"
                >
                  <div class="course-icon-wrapper flex-shrink-0">
                    <BookOpen :size="18" class="text-white" />
                  </div>
                  <div class="flex-grow-1 min-width-0">
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <h6 class="mb-0 text-truncate">{{ course.name }}</h6>
                      <span class="badge bg-light text-muted border flex-shrink-0">{{ course.category }}</span>
                    </div>
                    <div class="d-flex align-items-center gap-3 mb-2">
                      <small class="text-muted">{{ course.instructor }}</small>
                      <small v-if="course.lastAccess" class="text-muted">
                        {{ formatRelativeTime(course.lastAccess) }}
                      </small>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <div class="progress flex-grow-1" style="height: 6px;">
                        <div
                          class="progress-bar"
                          :class="getProgressColor(course.progress)"
                          :style="`width: ${course.progress}%`"
                        ></div>
                      </div>
                      <small class="fw-semibold text-nowrap" style="min-width: 36px;">{{ course.progress }}%</small>
                    </div>
                  </div>
                  <button
                    class="btn btn-sm btn-primary d-flex align-items-center gap-1 flex-shrink-0"
                    @click.stop="goToCourse(course)"
                  >
                    <Play :size="14" />
                    <span class="d-none d-md-inline">Продолжить</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Активность за неделю -->
        <div class="col-lg-4 mb-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent py-3">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2">
                  <Activity :size="18" class="text-info" />
                  <h6 class="mb-0 fw-semibold">Активность за неделю</h6>
                </div>
                <span class="badge bg-info-subtle text-info">{{ totalWeeklyHours.toFixed(1) }} ч</span>
              </div>
            </div>
            <div class="card-body d-flex flex-column justify-content-end">
              <div class="weekly-chart d-flex align-items-end justify-content-between gap-2" style="height: 140px;">
                <div
                  v-for="day in dashboardData.weeklyActivity"
                  :key="day.day"
                  class="weekly-bar-wrapper text-center flex-fill"
                >
                  <div class="weekly-bar-container d-flex flex-column align-items-center justify-content-end" style="height: 120px;">
                    <small v-if="day.hours > 0" class="weekly-bar-value text-muted mb-1">{{ day.hours }}</small>
                    <div
                      class="weekly-bar rounded-top"
                      :style="`height: ${day.hours > 0 ? Math.max((day.hours / maxWeeklyHours) * 100, 8) : 4}%`"
                      :class="day.hours > 0 ? 'bg-primary' : 'bg-light'"
                    ></div>
                  </div>
                  <small class="text-muted mt-1 d-block">{{ day.day }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <!-- Предстоящие события -->
        <div class="col-lg-6 mb-3">
          <div class="card border-0 shadow-sm h-100 dashboard-paired-card dashboard-events-card">
            <div class="card-header bg-transparent d-flex align-items-center justify-content-between py-3">
              <div class="d-flex align-items-center gap-2">
                <Calendar :size="18" class="text-warning" />
                <h6 class="mb-0 fw-semibold">Предстоящие события</h6>
              </div>
              <button class="btn btn-sm btn-link text-decoration-none p-0" @click="goToRoute('LMSCalendar')">
                Все <ChevronRight :size="14" class="align-middle" />
              </button>
            </div>
            <div class="card-body dashboard-paired-body">
              <div v-if="!dashboardData.upcomingEvents?.length" class="text-center py-4 text-muted">
                <Calendar :size="36" class="mb-2 opacity-50" />
                <p class="mb-0">Нет предстоящих событий</p>
              </div>
              <div v-else>
                <div
                  v-for="event in dashboardData.upcomingEvents"
                  :key="event.id"
                  class="event-item d-flex gap-3 mb-3"
                >
                  <div class="event-date-badge text-center flex-shrink-0">
                    <div class="event-day fw-bold">{{ formatEventDate(event.date).day }}</div>
                    <div class="event-month text-uppercase">{{ formatEventDate(event.date).month }}</div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <h6 class="mb-0 fs-sm">{{ event.title }}</h6>
                      <span class="badge" :class="getEventConfig(event.type).class">
                        {{ getEventConfig(event.type).label }}
                      </span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                      <small class="text-muted">
                        <Clock :size="12" class="me-1 align-middle" />{{ formatEventTime(event.date) }}
                      </small>
                      <small v-if="event.location" class="text-muted">
                        <MapPin :size="12" class="me-1 align-middle" />{{ event.location }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Уведомления -->
        <div class="col-lg-6 mb-3">
          <div class="card border-0 shadow-sm h-100 dashboard-paired-card dashboard-notifications-card">
            <div class="card-header bg-transparent d-flex align-items-center justify-content-between py-3">
              <div class="d-flex align-items-center gap-2">
                <Bell :size="18" class="text-danger" />
                <h6 class="mb-0 fw-semibold">Уведомления</h6>
                <span
                  v-if="dashboardData.notifications?.filter(n => !n.read).length"
                  class="badge bg-danger rounded-pill"
                >
                  {{ dashboardData.notifications.filter(n => !n.read).length }}
                </span>
              </div>
              <button class="btn btn-sm btn-link text-decoration-none p-0" @click="goToRoute('LMSNotifications')">
                Все уведомления <ChevronRight :size="14" class="align-middle" />
              </button>
            </div>
            <div class="card-body dashboard-paired-body">
              <div v-if="!dashboardData.notifications?.length" class="text-center py-4 text-muted">
                <Bell :size="36" class="mb-2 opacity-50" />
                <p class="mb-0">Нет новых уведомлений</p>
              </div>
              <div v-else>
                <div
                  v-for="notification in displayedNotifications"
                  :key="notification.id"
                  class="notification-item d-flex gap-3 mb-3"
                  :class="{ 'notification-unread': !notification.read }"
                >
                  <div class="notification-icon flex-shrink-0">
                    <component
                      :is="getNotificationConfig(notification.type).icon"
                      :size="16"
                      :class="getNotificationConfig(notification.type).color"
                    />
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-1 notification-text">{{ notification.message }}</p>
                    <small class="text-muted">{{ formatRelativeTime(notification.createdAt) }}</small>
                  </div>
                  <div v-if="!notification.read" class="unread-dot flex-shrink-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Достижения -->
      <div class="row g-3 mb-3">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent d-flex align-items-center justify-content-between py-3">
              <div class="d-flex align-items-center gap-2">
                <Award :size="18" class="text-warning" />
                <h6 class="mb-0 fw-semibold">Достижения</h6>
              </div>
              <button class="btn btn-sm btn-link text-decoration-none p-0" @click="goToRoute('LMSBadges')">
                Все достижения <ChevronRight :size="14" class="align-middle" />
              </button>
            </div>
            <div class="card-body">
              <div v-if="!dashboardData.achievements?.length" class="text-center py-4 text-muted">
                <Award :size="36" class="mb-2 opacity-50" />
                <p class="mb-0">Пока нет достижений</p>
              </div>
              <div v-else class="row g-3">
                <div
                  v-for="achievement in dashboardData.achievements"
                  :key="achievement.id"
                  class="col-xl col-md-4 col-sm-6"
                >
                  <div
                    class="achievement-card text-center p-3 rounded-3 h-100"
                    :class="achievement.earned ? 'achievement-earned' : 'achievement-locked'"
                  >
                    <div class="achievement-badge mx-auto mb-2" :class="achievement.earned ? 'earned' : 'locked'">
                      <component :is="resolveIcon(achievement.icon)" :size="22" />
                    </div>
                    <h6 class="mb-1 fs-sm" :class="{ 'text-muted': !achievement.earned }">
                      {{ achievement.title }}
                    </h6>
                    <small class="text-muted d-block mb-2">{{ achievement.description }}</small>
                    <div v-if="achievement.earned">
                      <span class="badge bg-success-subtle text-success">Получено</span>
                    </div>
                    <div v-else-if="achievement.progress !== undefined">
                      <div class="progress mx-auto" style="height: 4px; max-width: 80px;">
                        <div class="progress-bar bg-warning" :style="`width: ${achievement.progress}%`"></div>
                      </div>
                      <small class="text-muted">{{ achievement.progress }}%</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import './dashboard.scss';
</style>
