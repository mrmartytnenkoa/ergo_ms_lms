<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Award, CheckCircle, Target, TrendingUp, Zap, Search, Lock,
  BookOpen, GraduationCap, Library, Flame, Timer, Star,
  Sparkles, MessageSquare, Heart, Users, Crown, Plus, Pencil, Trash2, Save, X
} from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import { lmsApi } from '../js/lmsApi'
import { globalUserRole } from '../composables/useUserRole'
import './badges.scss'

const allBadges = ref([])
const earnedBadges = ref([])
const loading = ref(true)
const activeTab = ref('all')
const searchQuery = ref('')
const formMode = ref('create')
const editingBadgeId = ref(null)
const manageSearch = ref('')

const defaultBadgeForm = () => ({
  name: '',
  description: '',
  badge_type: '',
  category: 'Обучение',
  tier: 'bronze',
  criteria: '',
  icon: 'Award',
  xp: 100,
  is_active: true,
  progress_current: null,
  progress_target: null
})

const badgeForm = ref(defaultBadgeForm())

const iconMap = {
  BookOpen, GraduationCap, Library, Flame, Timer, Star,
  Award, Sparkles, MessageSquare, Heart, Users, Zap, Target, Crown
}

const tierConfig = {
  bronze: { label: 'Бронза', class: 'tier-bronze', badgeClass: 'bg-warning-subtle text-warning' },
  silver: { label: 'Серебро', class: 'tier-silver', badgeClass: 'bg-secondary-subtle text-secondary' },
  gold: { label: 'Золото', class: 'tier-gold', badgeClass: 'bg-warning text-dark' }
}

const categories = computed(() => [...new Set(allBadges.value.map(b => b.category))])

const tabs = computed(() => [
  { key: 'all', label: 'Все' },
  ...categories.value.map(c => ({ key: c, label: c }))
])

const categoryOptions = computed(() => {
  const base = ['Обучение', 'Регулярность', 'Академические', 'Социальные', 'Мастерство']
  return [...new Set([...base, ...allBadges.value.map(b => b.category).filter(Boolean)])]
})

const iconOptions = Object.keys(iconMap)

const managedBadges = computed(() => {
  if (!manageSearch.value) return allBadges.value
  const q = manageSearch.value.toLowerCase()
  return allBadges.value.filter(b =>
    b.name?.toLowerCase().includes(q) ||
    b.category?.toLowerCase().includes(q) ||
    b.badge_type?.toLowerCase().includes(q)
  )
})

const earnedIds = computed(() => new Set(earnedBadges.value.map(e => e.badge)))

function isEarned(id) { return earnedIds.value.has(id) }

function getEarnedDate(id) {
  const e = earnedBadges.value.find(eb => eb.badge === id)
  return e ? new Date(e.awarded_at).toLocaleDateString('ru', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
}

const statItems = [
  { key: 'earned', label: 'Получено', icon: CheckCircle, color: 'success' },
  { key: 'available', label: 'Доступно', icon: Target, color: 'primary' },
  { key: 'progress', label: 'Прогресс', icon: TrendingUp, color: 'warning' },
  { key: 'xp', label: 'Очков XP', icon: Zap, color: 'info' }
]

const stats = computed(() => {
  const earned = earnedBadges.value.length
  const total = allBadges.value.length
  const xp = allBadges.value
    .filter(b => isEarned(b.id))
    .reduce((s, b) => s + (b.xp || 0), 0)
  return {
    earned,
    available: total,
    progress: total > 0 ? Math.round((earned / total) * 100) + '%' : '0%',
    xp
  }
})

function tabCount(key) {
  if (key === 'all') return allBadges.value.length
  return allBadges.value.filter(b => b.category === key).length
}

const filteredBadges = computed(() => {
  let result = allBadges.value
  if (activeTab.value !== 'all') {
    result = result.filter(b => b.category === activeTab.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(b =>
      b.name?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q)
    )
  }
  return result.sort((a, b) => {
    const ae = isEarned(a.id), be = isEarned(b.id)
    if (ae !== be) return ae ? -1 : 1
    const tierOrder = { gold: 0, silver: 1, bronze: 2 }
    return (tierOrder[a.tier] ?? 3) - (tierOrder[b.tier] ?? 3)
  })
})

const recentEarned = computed(() => {
  return [...earnedBadges.value]
    .sort((a, b) => new Date(b.awarded_at) - new Date(a.awarded_at))
    .slice(0, 3)
    .map(e => {
      const badge = allBadges.value.find(b => b.id === e.badge)
      return badge ? { ...badge, awarded_at: e.awarded_at } : null
    })
    .filter(Boolean)
})

const donutOptions = computed(() => ({
  chart: { type: 'donut', height: 240 },
  labels: categories.value,
  colors: ['#0d6efd', '#fd7e14', '#198754', '#0dcaf0', '#6f42c1'],
  legend: { position: 'bottom', fontSize: '12px' },
  plotOptions: { pie: { donut: { size: '55%' } } },
  dataLabels: { enabled: true, formatter: (val) => val.toFixed(0) + '%' }
}))

const donutSeries = computed(() =>
  categories.value.map(cat =>
    allBadges.value.filter(b => b.category === cat && isEarned(b.id)).length
  )
)

function getIcon(name) { return iconMap[name] || Award }

function getTier(tier) { return tierConfig[tier] || tierConfig.bronze }

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ru', { day: 'numeric', month: 'short' })
}

function startCreateBadge() {
  formMode.value = 'create'
  editingBadgeId.value = null
  badgeForm.value = defaultBadgeForm()
}

function startEditBadge(badge) {
  formMode.value = 'edit'
  editingBadgeId.value = badge.id
  badgeForm.value = {
    name: badge.name || '',
    description: badge.description || '',
    badge_type: badge.badge_type || '',
    category: badge.category || 'Обучение',
    tier: badge.tier || 'bronze',
    criteria: badge.criteria || '',
    icon: badge.icon || 'Award',
    xp: Number(badge.xp ?? 0),
    is_active: Boolean(badge.is_active),
    progress_current: badge.progress?.current ?? null,
    progress_target: badge.progress?.target ?? null
  }
}

function upsertBadge() {
  if (!badgeForm.value.name.trim()) return
  if (!badgeForm.value.badge_type.trim()) return

  const payload = {
    name: badgeForm.value.name.trim(),
    description: badgeForm.value.description.trim(),
    badge_type: badgeForm.value.badge_type.trim(),
    category: badgeForm.value.category,
    tier: badgeForm.value.tier,
    criteria: badgeForm.value.criteria.trim(),
    icon: badgeForm.value.icon,
    xp: Number(badgeForm.value.xp || 0),
    is_active: Boolean(badgeForm.value.is_active)
  }

  const hasProgress = badgeForm.value.progress_current !== null && badgeForm.value.progress_target !== null
  if (hasProgress && Number(badgeForm.value.progress_target) > 0) {
    payload.progress = {
      current: Number(badgeForm.value.progress_current),
      target: Number(badgeForm.value.progress_target)
    }
  }

  if (formMode.value === 'edit' && editingBadgeId.value !== null) {
    allBadges.value = allBadges.value.map(b =>
      b.id === editingBadgeId.value ? { ...b, ...payload } : b
    )
  } else {
    const nextId = allBadges.value.length ? Math.max(...allBadges.value.map(b => b.id)) + 1 : 1
    allBadges.value.unshift({ id: nextId, ...payload })
  }

  startCreateBadge()
}

function removeBadge(id) {
  allBadges.value = allBadges.value.filter(b => b.id !== id)
  earnedBadges.value = earnedBadges.value.filter(e => e.badge !== id)
  if (editingBadgeId.value === id) startCreateBadge()
}

async function loadBadges() {
  try {
    loading.value = true
    const response = await lmsApi.getMyBadges()
    allBadges.value = response.badges || []
    earnedBadges.value = response.earned || []
  } catch (error) {
    console.error('Ошибка загрузки достижений:', error)
    allBadges.value = []
    earnedBadges.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  globalUserRole.loadUserRoles().then(() => loadBadges())
})
</script>

<template>
  <div class="badges-view">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h3 class="mb-1 d-flex align-items-center">
          <Award :size="26" class="me-2 text-primary" style="vertical-align: middle" />
          Мои достижения
        </h3>
        <p class="text-muted mb-0 small">Отслеживайте прогресс и получайте награды за успехи</p>
      </div>
    </div>

    <div class="card badge-management-card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h5 class="mb-0 d-flex align-items-center gap-2">
            <Award :size="18" class="text-primary" />
            Управление достижениями
          </h5>
          <button
            v-if="formMode === 'edit'"
            class="btn btn-outline-secondary btn-sm"
            @click="startCreateBadge"
          >
            <X :size="14" class="me-1" /> Отменить редактирование
          </button>
        </div>

        <div class="row g-3">
          <div class="col-lg-7">
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label small mb-1">Название</label>
                <input v-model="badgeForm.name" class="form-control form-control-sm" placeholder="Например: Спринтер" />
              </div>
              <div class="col-md-6">
                <label class="form-label small mb-1">Тип достижения</label>
                <input v-model="badgeForm.badge_type" class="form-control form-control-sm" placeholder="Например: sprint_5" />
              </div>
              <div class="col-12">
                <label class="form-label small mb-1">Описание</label>
                <textarea v-model="badgeForm.description" class="form-control form-control-sm" rows="2" placeholder="Короткое описание достижения"></textarea>
              </div>
              <div class="col-md-4">
                <label class="form-label small mb-1">Категория</label>
                <select v-model="badgeForm.category" class="form-select form-select-sm">
                  <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small mb-1">Уровень</label>
                <select v-model="badgeForm.tier" class="form-select form-select-sm">
                  <option value="bronze">Бронза</option>
                  <option value="silver">Серебро</option>
                  <option value="gold">Золото</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small mb-1">Иконка</label>
                <select v-model="badgeForm.icon" class="form-select form-select-sm">
                  <option v-for="icon in iconOptions" :key="icon" :value="icon">{{ icon }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label small mb-1">XP</label>
                <input v-model.number="badgeForm.xp" type="number" min="0" class="form-control form-control-sm" />
              </div>
              <div class="col-md-4">
                <label class="form-label small mb-1">Прогресс: текущее</label>
                <input v-model.number="badgeForm.progress_current" type="number" min="0" class="form-control form-control-sm" />
              </div>
              <div class="col-md-4">
                <label class="form-label small mb-1">Прогресс: цель</label>
                <input v-model.number="badgeForm.progress_target" type="number" min="0" class="form-control form-control-sm" />
              </div>
              <div class="col-12">
                <label class="form-label small mb-1">Критерий получения</label>
                <input v-model="badgeForm.criteria" class="form-control form-control-sm" placeholder="Что нужно сделать для получения" />
              </div>
              <div class="col-12 d-flex justify-content-between align-items-center">
                <div class="form-check form-switch">
                  <input id="badge-active-switch" v-model="badgeForm.is_active" class="form-check-input" type="checkbox" />
                  <label class="form-check-label small" for="badge-active-switch">Активное достижение</label>
                </div>
                <button
                  class="btn btn-primary btn-sm"
                  :disabled="!badgeForm.name.trim() || !badgeForm.badge_type.trim()"
                  @click="upsertBadge"
                >
                  <component :is="formMode === 'edit' ? Save : Plus" :size="14" class="me-1" />
                  {{ formMode === 'edit' ? 'Сохранить изменения' : 'Добавить достижение' }}
                </button>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="management-list-header mb-2">
              <div class="input-group input-group-sm">
                <span class="input-group-text"><Search :size="14" /></span>
                <input v-model="manageSearch" class="form-control" placeholder="Поиск в списке..." />
              </div>
            </div>
            <div class="management-list">
              <div v-if="managedBadges.length === 0" class="text-muted small py-3 text-center">
                Ничего не найдено
              </div>
              <div v-else v-for="badge in managedBadges" :key="`manage-${badge.id}`" class="management-item">
                <div class="d-flex align-items-center gap-2 min-w-0">
                  <div :class="`manage-icon ${getTier(badge.tier).class}`">
                    <component :is="getIcon(badge.icon)" :size="14" />
                  </div>
                  <div class="min-w-0">
                    <div class="fw-semibold text-truncate">{{ badge.name }}</div>
                    <small class="text-muted">{{ badge.category }} · {{ badge.badge_type }}</small>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-1">
                  <button class="btn btn-outline-primary btn-sm" @click="startEditBadge(badge)">
                    <Pencil :size="13" />
                  </button>
                  <button class="btn btn-outline-danger btn-sm" @click="removeBadge(badge.id)">
                    <Trash2 :size="13" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
      <p class="mt-3 text-muted">Загрузка достижений...</p>
    </div>

    <template v-else-if="allBadges.length > 0">
      <!-- Stat Cards -->
      <div class="row mb-4 g-3">
        <div v-for="item in statItems" :key="item.key" class="col-xl-3 col-sm-6">
          <div class="card stat-card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3 py-3">
              <div :class="`stat-icon-wrapper bg-${item.color}-subtle text-${item.color}`">
                <component :is="item.icon" :size="20" />
              </div>
              <div>
                <div class="stat-label text-muted mb-1">{{ item.label }}</div>
                <div class="stat-value">{{ stats[item.key] }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts + Recent -->
      <div class="row mb-4 g-3">
        <div class="col-lg-5">
          <div class="card chart-container shadow-sm h-100">
            <div class="card-body">
              <h6 class="mb-3 fw-semibold">По категориям</h6>
              <VueApexCharts type="donut" :options="donutOptions" :series="donutSeries" height="240" />
            </div>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="card shadow-sm h-100" style="border-radius: 12px; border: none">
            <div class="card-body">
              <h6 class="mb-3 fw-semibold">Недавние достижения</h6>
              <div v-if="recentEarned.length > 0">
                <div v-for="badge in recentEarned" :key="badge.id" class="recent-achievement">
                  <div :class="`recent-icon ${getTier(badge.tier).class}`">
                    <component :is="getIcon(badge.icon)" :size="18" />
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-semibold small">{{ badge.name }}</div>
                    <div class="text-muted" style="font-size: 0.78rem">{{ badge.description }}</div>
                  </div>
                  <div class="text-end">
                    <span class="text-muted small">{{ formatDate(badge.awarded_at) }}</span>
                    <div>
                      <span class="xp-badge bg-info-subtle text-info">+{{ badge.xp }} XP</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-muted py-4">
                <Award :size="32" class="mb-2" />
                <p class="small mb-0">Пока нет полученных достижений</p>
              </div>

              <!-- Category progress bars -->
              <h6 class="mt-4 mb-3 fw-semibold">Прогресс по категориям</h6>
              <div v-for="cat in categories" :key="cat" class="mb-2">
                <div class="d-flex justify-content-between small mb-1">
                  <span>{{ cat }}</span>
                  <span class="text-muted">
                    {{ allBadges.filter(b => b.category === cat && isEarned(b.id)).length }}/{{ allBadges.filter(b => b.category === cat).length }}
                  </span>
                </div>
                <div class="progress" style="height: 5px">
                  <div
                    class="progress-bar bg-primary"
                    :style="{ width: (allBadges.filter(b => b.category === cat).length > 0 ? (allBadges.filter(b => b.category === cat && isEarned(b.id)).length / allBadges.filter(b => b.category === cat).length * 100) : 0) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs + Search -->
      <div class="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-3 border-bottom">
        <ul class="nav filter-tabs mb-0">
          <li v-for="tab in tabs" :key="tab.key" class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
              <span class="badge bg-secondary-subtle text-secondary ms-1">{{ tabCount(tab.key) }}</span>
            </button>
          </li>
        </ul>
        <div class="input-group input-group-sm search-input mb-2">
          <span class="input-group-text border-end-0"><Search :size="14" /></span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control border-start-0"
            placeholder="Поиск по названию..."
          />
        </div>
      </div>

      <!-- Badge Cards Grid -->
      <div v-if="filteredBadges.length > 0" class="row g-3">
        <div v-for="badge in filteredBadges" :key="badge.id" class="col-xl-3 col-lg-4 col-sm-6">
          <div class="card badge-card shadow-sm h-100" :class="{ earned: isEarned(badge.id), locked: !isEarned(badge.id) }">
            <div class="card-body text-center py-4">
              <!-- Icon circle -->
              <div :class="`badge-icon-circle ${getTier(badge.tier).class} mb-3`">
                <component :is="getIcon(badge.icon)" :size="28" />
                <div v-if="isEarned(badge.id)" class="earned-check-overlay">
                  <CheckCircle :size="14" />
                </div>
                <div v-else class="locked-overlay">
                  <Lock :size="12" />
                </div>
              </div>

              <!-- Name -->
              <h6 class="fw-bold mb-1" :class="{ 'text-muted': !isEarned(badge.id) }">{{ badge.name }}</h6>
              <p class="text-muted small mb-2" style="min-height: 2.4em">{{ badge.description }}</p>

              <!-- Tier + XP -->
              <div class="d-flex justify-content-center gap-2 mb-2">
                <span :class="`tier-badge ${getTier(badge.tier).badgeClass}`">{{ getTier(badge.tier).label }}</span>
                <span class="xp-badge bg-info-subtle text-info">+{{ badge.xp }} XP</span>
              </div>

              <!-- Progress bar (for unearned with progress) -->
              <div v-if="!isEarned(badge.id) && badge.progress" class="badge-progress mb-2 px-2">
                <div class="progress">
                  <div
                    class="progress-bar bg-primary"
                    :style="{ width: (badge.progress.current / badge.progress.target * 100) + '%' }"
                  ></div>
                </div>
                <div class="text-muted small mt-1">{{ badge.progress.current }} / {{ badge.progress.target }}</div>
              </div>

              <!-- Earned date -->
              <div v-if="isEarned(badge.id)" class="mt-2">
                <small class="text-success fw-medium">
                  <CheckCircle :size="13" class="me-1" style="vertical-align: middle" />
                  {{ getEarnedDate(badge.id) }}
                </small>
              </div>

              <!-- Criteria for locked -->
              <div v-else class="criteria-block mt-2 text-muted text-start">
                <Target :size="12" class="me-1" style="vertical-align: middle" />
                {{ badge.criteria }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty filtered -->
      <div v-else class="empty-state text-center">
        <div class="empty-icon bg-light">
          <Search :size="32" class="text-muted" />
        </div>
        <h6 class="text-muted">Значки не найдены</h6>
        <p class="text-muted small">Попробуйте изменить фильтры или поисковый запрос</p>
      </div>
    </template>

    <!-- No badges at all -->
    <div v-else class="empty-state text-center">
      <div class="empty-icon bg-primary-subtle">
        <Award :size="36" class="text-primary" />
      </div>
      <h5 class="text-muted">Достижения пока недоступны</h5>
      <p class="text-muted">Начните обучение, чтобы открыть систему достижений</p>
    </div>
  </div>
</template>
