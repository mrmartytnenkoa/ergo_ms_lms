<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bell, ClipboardCheck, FileCheck, Award, BookOpen, Zap, CheckCheck, Check } from 'lucide-vue-next'
import { useUtils } from '../composables/useUtils'
import { lmsApi } from '../js/lmsApi'

const { formatRelativeTime } = useUtils()

const loading = ref(true)
const notifications = ref([])
const activeFilter = ref('all')
const markingAllRead = ref(false)
const markingId = ref(null)

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

function getConfig(type) {
  return notificationIconMap[type] || { icon: Bell, color: 'text-secondary' }
}

const unreadCount = computed(() =>
  notifications.value.filter(n => !n.read).length
)

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  }
  return notifications.value
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

onMounted(() => loadNotifications())
</script>

<template>
  <div class="notifications-view">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div class="d-flex align-items-center gap-3">
        <h4 class="mb-0 fw-bold">Уведомления</h4>
        <span v-if="unreadCount" class="badge bg-danger rounded-pill">{{ unreadCount }}</span>
      </div>
      <button
        class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
        :disabled="!unreadCount || markingAllRead"
        @click="markAllRead"
      >
        <CheckCheck :size="16" />
        Прочитать все
      </button>
    </div>

    <div class="btn-group mb-4" role="group">
      <button
        type="button"
        class="btn btn-sm"
        :class="activeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'"
        @click="activeFilter = 'all'"
      >
        Все
        <span class="ms-1 badge" :class="activeFilter === 'all' ? 'bg-white text-primary' : 'bg-primary'">
          {{ notifications.length }}
        </span>
      </button>
      <button
        type="button"
        class="btn btn-sm"
        :class="activeFilter === 'unread' ? 'btn-primary' : 'btn-outline-primary'"
        @click="activeFilter = 'unread'"
      >
        Непрочитанные
        <span v-if="unreadCount" class="ms-1 badge" :class="activeFilter === 'unread' ? 'bg-white text-primary' : 'bg-danger'">
          {{ unreadCount }}
        </span>
      </button>
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
          {{ activeFilter === 'unread' ? 'Нет непрочитанных уведомлений' : 'Нет уведомлений' }}
        </p>
      </div>
    </div>

    <div v-else class="card border-0 shadow-sm">
      <div
        v-for="(notification, index) in filteredNotifications"
        :key="notification.id"
        class="notification-item d-flex align-items-start gap-3 px-4 py-3"
        :class="[
          { 'notification-unread': !notification.read },
          { 'border-bottom': index < filteredNotifications.length - 1 }
        ]"
      >
        <div class="notification-icon-wrap flex-shrink-0 mt-1">
          <component
            :is="getConfig(notification.type).icon"
            :size="20"
            :class="getConfig(notification.type).color"
          />
        </div>

        <div class="flex-grow-1 min-width-0">
          <p class="mb-1 notification-text" :class="{ 'fw-semibold': !notification.read }">
            {{ notification.message }}
          </p>
          <small class="text-muted">{{ formatRelativeTime(notification.createdAt) }}</small>
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
.notification-item {
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--bs-light);
  }

  &.notification-unread {
    background-color: rgba(var(--bs-primary-rgb), 0.04);
    border-left: 3px solid var(--bs-primary) !important;
  }
}

.notification-icon-wrap {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bs-light);
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
