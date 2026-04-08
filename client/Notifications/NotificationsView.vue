<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Bell,
  ClipboardCheck,
  FileCheck,
  Award,
  BookOpen,
  Zap,
  CheckCheck,
  Check,
  AlertTriangle,
  CircleAlert,
  Search,
  Filter,
  Clock3
} from 'lucide-vue-next'
import { useUtils } from '../composables/useUtils'
import { lmsApi } from '../js/lmsApi'

const { formatRelativeTime } = useUtils()

const loading = ref(true)
const notifications = ref([])
const activeFilter = ref('all')
const search = ref('')
const markingAllRead = ref(false)
const markingId = ref(null)

const notificationIconMap = {
  grading: { icon: ClipboardCheck, color: 'text-success', tone: 'success', priority: 'normal', label: 'Оценки' },
  assignment: { icon: FileCheck, color: 'text-primary', tone: 'primary', priority: 'high', label: 'Задания' },
  badge: { icon: Award, color: 'text-warning', tone: 'warning', priority: 'normal', label: 'Достижения' },
  enrollment: { icon: BookOpen, color: 'text-info', tone: 'info', priority: 'normal', label: 'Курсы' },
  info: { icon: Bell, color: 'text-secondary', tone: 'secondary', priority: 'normal', label: 'Системные' },
  success: { icon: Zap, color: 'text-success', tone: 'success', priority: 'normal', label: 'Успех' },
  warning: { icon: AlertTriangle, color: 'text-warning', tone: 'warning', priority: 'critical', label: 'Срочные' },
  error: { icon: CircleAlert, color: 'text-danger', tone: 'danger', priority: 'critical', label: 'Ошибка' }
}

function getConfig(type) {
  return notificationIconMap[type] || { icon: Bell, color: 'text-secondary', tone: 'secondary', priority: 'normal', label: 'Другое' }
}

const filterDefinitions = [
  { key: 'all', label: 'Все' },
  { key: 'unread', label: 'Непрочитанные' },
  { key: 'critical', label: 'Срочные' },
  { key: 'assignment', label: 'Задания' },
  { key: 'grading', label: 'Оценки' },
  { key: 'info', label: 'Системные' }
]

function getFilterCount(key) {
  if (key === 'all') return notifications.value.length
  if (key === 'unread') return notifications.value.filter(item => !item.read).length
  if (key === 'critical') return notifications.value.filter(item => getConfig(item.type).priority === 'critical').length
  return notifications.value.filter(item => item.type === key).length
}

function matchesFilter(notification) {
  if (activeFilter.value === 'all') return true
  if (activeFilter.value === 'unread') return !notification.read
  if (activeFilter.value === 'critical') return getConfig(notification.type).priority === 'critical'
  return notification.type === activeFilter.value
}

const unreadCount = computed(() =>
  notifications.value.filter(n => !n.read).length
)

const criticalCount = computed(() =>
  notifications.value.filter(n => getConfig(n.type).priority === 'critical').length
)

const filteredNotifications = computed(() => {
  const searchValue = search.value.trim().toLowerCase()

  return notifications.value
    .filter(matchesFilter)
    .filter(item => (searchValue ? item.message.toLowerCase().includes(searchValue) : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

async function loadNotifications() {
  loading.value = true
  try {
    const response = await lmsApi.getNotifications()
    notifications.value = response?.data?.results || response?.data || []
  } catch (error) {
    console.error('Ошибка загрузки уведомлений:', error)
  } finally {
    loading.value = false
  }
}

async function markAsRead(notification) {
  if (notification.read) return
  markingId.value = notification.id
  try {
    await lmsApi.markNotificationAsRead(notification.id)
    notification.read = true
  } catch (error) {
    console.error('Ошибка при отметке уведомления:', error)
  } finally {
    markingId.value = null
  }
}

async function markAllRead() {
  if (!unreadCount.value) return
  markingAllRead.value = true
  try {
    await lmsApi.markAllNotificationsAsRead()
    notifications.value.forEach(n => { n.read = true })
  } catch (error) {
    console.error('Ошибка при отметке всех уведомлений:', error)
  } finally {
    markingAllRead.value = false
  }
}

function getItemClasses(notification) {
  const config = getConfig(notification.type)
  return {
    'notification-item': true,
    'notification-unread': !notification.read,
    'notification-critical': config.priority === 'critical'
  }
}

onMounted(() => loadNotifications())
</script>

<template>
  <div class="notifications-view container-fluid px-0">
    <div class="notifications-header card border-0 shadow-sm mb-4">
      <div class="card-body p-3 p-md-4">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div class="d-flex align-items-center gap-3">
            <div class="header-icon">
              <Bell :size="20" />
            </div>
            <div>
              <h4 class="mb-0 fw-bold">Центр уведомлений</h4>
              <p class="mb-0 text-muted small">Лента событий по курсам, дедлайнам и проверкам</p>
            </div>
          </div>
          <button
            class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            :disabled="!unreadCount || markingAllRead"
            @click="markAllRead"
          >
            <CheckCheck :size="16" />
            Отметить все прочитанными
          </button>
        </div>

        <div class="row g-2 mt-3">
          <div class="col-12 col-md-4">
            <div class="metric-card">
              <div class="metric-label">Всего</div>
              <div class="metric-value">{{ notifications.length }}</div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="metric-card metric-card--unread">
              <div class="metric-label">Непрочитанные</div>
              <div class="metric-value">{{ unreadCount }}</div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="metric-card metric-card--critical">
              <div class="metric-label">Срочные</div>
              <div class="metric-value">{{ criticalCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-3 p-md-4">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div class="search-wrap">
            <Search :size="16" class="search-icon" />
            <input
              v-model="search"
              type="text"
              class="form-control form-control-sm ps-5"
              placeholder="Поиск по уведомлениям"
            >
          </div>
          <div class="d-flex align-items-center gap-2 text-muted small">
            <Filter :size="14" />
            Фильтры
          </div>
        </div>

        <div class="chips">
          <button
            v-for="filter in filterDefinitions"
            :key="filter.key"
            type="button"
            class="chip-btn"
            :class="{ 'chip-btn--active': activeFilter === filter.key }"
            @click="activeFilter = filter.key"
          >
            <span>{{ filter.label }}</span>
            <span class="chip-badge">{{ getFilterCount(filter.key) }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>

    <div v-else-if="!filteredNotifications.length" class="card border-0 shadow-sm">
      <div class="card-body text-center py-5 text-muted">
        <Bell :size="48" class="mb-3 opacity-50" />
        <p class="mb-0 fs-5">
          Уведомления по текущему фильтру не найдены
        </p>
      </div>
    </div>

    <div v-else class="card border-0 shadow-sm">
      <div
        v-for="(notification, index) in filteredNotifications"
        :key="notification.id"
        class="d-flex align-items-start gap-3 px-3 px-md-4 py-3"
        :class="[getItemClasses(notification), { 'border-bottom': index < filteredNotifications.length - 1 }]"
      >
        <div class="notification-icon-wrap flex-shrink-0 mt-1" :class="`notification-icon-wrap--${getConfig(notification.type).tone}`">
          <component
            :is="getConfig(notification.type).icon"
            :size="20"
            :class="getConfig(notification.type).color"
          />
        </div>

        <div class="flex-grow-1 min-width-0">
          <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
            <span class="badge rounded-pill text-bg-light border">{{ getConfig(notification.type).label }}</span>
            <span v-if="getConfig(notification.type).priority === 'critical'" class="badge rounded-pill text-bg-danger">Срочно</span>
          </div>
          <p class="mb-1 notification-text" :class="{ 'fw-semibold': !notification.read }">
            {{ notification.message }}
          </p>
          <small class="text-muted d-inline-flex align-items-center gap-1">
            <Clock3 :size="13" />
            {{ formatRelativeTime(notification.createdAt) }}
          </small>
        </div>

        <div class="d-flex align-items-center gap-2 flex-shrink-0">
          <span v-if="!notification.read" class="badge bg-danger-subtle text-danger border border-danger-subtle">
            Новое
          </span>
          <button
            v-if="!notification.read"
            class="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            :disabled="markingId === notification.id"
            @click="markAsRead(notification)"
          >
            <Check :size="14" />
            <span>Прочитать</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notifications-header {
  position: sticky;
  top: 0;
  z-index: 2;
}

.header-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--bs-primary-rgb), 0.12);
  color: var(--bs-primary);
}

.metric-card {
  border-radius: 12px;
  border: 1px solid var(--bs-border-color);
  padding: 0.7rem 0.85rem;
  background: #fff;
}

.metric-card--unread {
  border-color: rgba(var(--bs-primary-rgb), 0.35);
  background: rgba(var(--bs-primary-rgb), 0.05);
}

.metric-card--critical {
  border-color: rgba(var(--bs-danger-rgb), 0.35);
  background: rgba(var(--bs-danger-rgb), 0.05);
}

.metric-label {
  font-size: 0.76rem;
  color: var(--bs-secondary-color);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.search-wrap {
  position: relative;
  width: min(100%, 360px);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--bs-secondary-color);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip-btn {
  border: 1px solid var(--bs-border-color);
  background: #fff;
  color: var(--bs-body-color);
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.82rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.chip-btn--active {
  background: rgba(var(--bs-primary-rgb), 0.1);
  border-color: rgba(var(--bs-primary-rgb), 0.3);
  color: var(--bs-primary);
}

.chip-badge {
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  padding: 0 0.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--bs-light);
  color: var(--bs-secondary-color);
  font-size: 0.75rem;
  font-weight: 600;
}

.notification-item {
  transition: background-color 0.15s ease, border-left-color 0.15s ease;
  border-left: 3px solid transparent;

  &:hover {
    background-color: var(--bs-light);
  }

  &.notification-unread {
    background-color: rgba(var(--bs-primary-rgb), 0.04);
    border-left-color: var(--bs-primary);
  }

  &.notification-critical {
    border-left-color: var(--bs-danger);
  }
}

.notification-icon-wrap {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bs-light);
  border-radius: 10px;
  flex-shrink: 0;
}

.notification-icon-wrap--primary {
  background: rgba(var(--bs-primary-rgb), 0.1);
}

.notification-icon-wrap--success {
  background: rgba(var(--bs-success-rgb), 0.12);
}

.notification-icon-wrap--warning {
  background: rgba(var(--bs-warning-rgb), 0.18);
}

.notification-icon-wrap--danger {
  background: rgba(var(--bs-danger-rgb), 0.12);
}

.notification-icon-wrap--info {
  background: rgba(var(--bs-info-rgb), 0.12);
}

.notification-icon-wrap--secondary {
  background: rgba(var(--bs-secondary-rgb), 0.12);
}
</style>
