<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  ClipboardList,
  Plus,
  Search,
  Clock,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Layers,
  ClipboardCheck
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import RoleGuard from '../components/RoleGuard.vue'
import { lmsApi } from '../js/lmsApi.js'
import './study-plans-constructor.scss'

const toast = useToast()
const loading = ref(true)
const plans = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const expandedIds = ref(new Set())
let searchDebounce = null

const statusTabs = [
  { value: '', label: 'Все' },
  { value: 'draft', label: 'Черновики' },
  { value: 'review', label: 'На согласовании' },
  { value: 'published', label: 'Утверждённые' }
]

const statusBadgeClass = {
  draft: 'bg-secondary',
  review: 'bg-warning text-dark',
  published: 'bg-success'
}

const statusLabel = {
  draft: 'Черновик',
  review: 'На согласовании',
  published: 'Утверждён'
}

const moduleTypeIcon = {
  lecture: BookOpen,
  practice: FlaskConical,
  exam: GraduationCap,
  mixed: Layers
}

const moduleTypeLabel = {
  lecture: 'Лекции',
  practice: 'Практика',
  exam: 'Аттестация',
  mixed: 'Смешанный'
}

async function loadPlans() {
  loading.value = true
  try {
    const res = await lmsApi.getStudyPlansList({
      search: searchQuery.value.trim(),
      status: statusFilter.value || undefined
    })
    plans.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error(e)
    plans.value = []
  } finally {
    loading.value = false
  }
}

function scheduleSearchLoad() {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    loadPlans()
  }, 300)
}

watch(statusFilter, () => {
  loadPlans()
})

watch(searchQuery, () => {
  scheduleSearchLoad()
})

onMounted(() => {
  loadPlans()
})

function setStatus(value) {
  statusFilter.value = value
}

function toggleExpanded(id) {
  const next = new Set(expandedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  expandedIds.value = next
}

function isExpanded(id) {
  return expandedIds.value.has(id)
}

function formatUpdated(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return iso
  }
}

function onCreatePlan() {
  toast.info('Создание планов будет доступно после подключения API.')
}

const hasFilters = () => Boolean(searchQuery.value.trim() || statusFilter.value)
</script>

<template>
  <RoleGuard
    :roles="['teacher', 'admin']"
    fallback-message="Раздел доступен преподавателям и администраторам"
  >
    <div class="spc-view container-fluid py-3">
      <div class="spc-hero">
        <div class="spc-hero__head">
          <div class="d-flex align-items-start gap-3">
            <div class="rounded-3 bg-primary bg-opacity-10 p-3 text-primary">
              <ClipboardList :size="32" />
            </div>
            <div>
              <h1 class="spc-hero__title">
                Конструктор учебных планов
              </h1>
              <p class="spc-hero__subtitle text-muted mb-0">
                Учебные планы направлений подготовки: структура модулей, трудоёмкость и статусы согласования.
                Данные ниже — демонстрационные, для проверки отображения.
              </p>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-primary d-inline-flex align-items-center gap-2"
            @click="onCreatePlan"
          >
            <Plus :size="18" />
            Создать план
          </button>
        </div>
      </div>

      <div class="spc-toolbar card mb-4">
        <div class="card-body py-3">
          <div class="row g-3 align-items-end">
            <div class="col-12 col-lg-5">
              <label class="form-label small text-muted mb-1">Поиск</label>
              <div class="input-group">
                <span class="input-group-text bg-transparent border-end-0">
                  <Search :size="18" class="text-muted" />
                </span>
                <input
                  v-model="searchQuery"
                  type="search"
                  class="form-control border-start-0"
                  placeholder="Название, шифр, автор…"
                  autocomplete="off"
                >
              </div>
            </div>
            <div class="col-12 col-lg-7">
              <span class="form-label small text-muted mb-1 d-block">Статус</span>
              <div class="spc-filter-pills d-flex flex-wrap gap-2">
                <button
                  v-for="tab in statusTabs"
                  :key="tab.value || 'all'"
                  type="button"
                  class="btn"
                  :class="statusFilter === tab.value ? 'btn-primary' : 'btn-outline-secondary'"
                  @click="setStatus(tab.value)"
                >
                  {{ tab.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="loading"
        class="spc-skeleton row g-4"
        aria-busy="true"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="col-md-6 col-xl-4"
        >
          <div class="card spc-plan-card">
            <div class="card-body">
              <span class="placeholder col-7 mb-3" />
              <span class="placeholder col-4 mb-2" />
              <span class="placeholder col-12 mb-2" />
              <span class="placeholder col-10 mb-0" />
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="plans.length === 0"
        class="spc-empty"
      >
        <ClipboardCheck
          :size="40"
          class="text-muted mb-3 opacity-50"
        />
        <h3 class="h5 mb-2">
          Нет планов по заданным условиям
        </h3>
        <p class="text-muted mb-0 small">
          <template v-if="hasFilters()">
            Измените поиск или фильтр статуса — в демо-наборе есть планы во всех состояниях.
          </template>
          <template v-else>
            Список пуст.
          </template>
        </p>
      </div>

      <div
        v-else
        class="row g-4"
      >
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="col-md-6 col-xl-4"
        >
          <div class="card spc-plan-card h-100 shadow-sm">
            <div class="card-body spc-plan-card__body">
              <div class="spc-plan-card__title-row mb-2">
                <div class="min-w-0">
                  <div class="spc-plan-card__code mb-1">
                    {{ plan.code }}
                  </div>
                  <h2 class="h6 mb-0 fw-semibold">
                    {{ plan.name }}
                  </h2>
                </div>
                <span
                  class="badge flex-shrink-0"
                  :class="statusBadgeClass[plan.status] || 'bg-secondary'"
                >
                  {{ statusLabel[plan.status] || plan.status }}
                </span>
              </div>

              <div class="small text-muted mb-2">
                {{ plan.level }} · {{ plan.academicYear }}
              </div>

              <div class="spc-meta-line">
                <Clock :size="16" />
                <span>{{ plan.totalHours }} ч. · {{ plan.credits }} з.е.</span>
              </div>
              <div class="spc-meta-line">
                <Calendar :size="16" />
                <span>Обновлено {{ formatUpdated(plan.updatedAt) }}</span>
              </div>
              <div class="spc-meta-line mb-2">
                <User :size="16" />
                <span>{{ plan.author }}</span>
              </div>

              <div
                v-if="plan.completionPercent != null"
                class="mb-3"
              >
                <div class="d-flex justify-content-between small text-muted mb-1">
                  <span>Заполнение структуры</span>
                  <span>{{ plan.completionPercent }}%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="{ width: `${Math.min(100, plan.completionPercent)}%` }"
                    :aria-valuenow="plan.completionPercent"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>

              <div class="spc-modules-panel">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary w-100 d-inline-flex align-items-center justify-content-center gap-2"
                  @click="toggleExpanded(plan.id)"
                >
                  <template v-if="isExpanded(plan.id)">
                    <ChevronUp :size="16" />
                    Свернуть модули
                  </template>
                  <template v-else>
                    <ChevronDown :size="16" />
                    Модули ({{ plan.modules?.length || 0 }})
                  </template>
                </button>
                <div
                  v-if="isExpanded(plan.id) && plan.modules?.length"
                  class="mt-2"
                >
                  <div
                    v-for="mod in plan.modules"
                    :key="`${plan.id}-${mod.order}`"
                    class="spc-module-row"
                  >
                    <div class="d-flex align-items-start gap-2 min-w-0">
                      <component
                        :is="moduleTypeIcon[mod.type] || Layers"
                        :size="16"
                        class="text-primary flex-shrink-0 mt-1"
                      />
                      <div class="min-w-0">
                        <div class="fw-medium">
                          {{ mod.order }}. {{ mod.title }}
                        </div>
                        <div class="text-muted small">
                          {{ moduleTypeLabel[mod.type] || mod.type }}
                        </div>
                      </div>
                    </div>
                    <span class="text-muted small flex-shrink-0">{{ mod.hours }} ч.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RoleGuard>
</template>
