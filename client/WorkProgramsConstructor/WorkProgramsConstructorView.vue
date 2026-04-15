<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  FileStack,
  Plus,
  Search,
  Clock,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FlaskConical,
  Layers,
  ClipboardCheck,
  Building2
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import RoleGuard from '../components/RoleGuard.vue'
import { lmsApi } from '../js/lmsApi.js'
import './work-programs-constructor.scss'

const toast = useToast()
const loading = ref(true)
const programs = ref([])
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

const sectionTypeIcon = {
  theory: BookOpen,
  practice: FlaskConical,
  control: ClipboardCheck,
  mixed: Layers
}

const sectionTypeLabel = {
  theory: 'Теория',
  practice: 'Практика',
  control: 'Контроль',
  mixed: 'Смешанный'
}

async function loadPrograms() {
  loading.value = true
  try {
    const res = await lmsApi.getWorkProgramsList({
      search: searchQuery.value.trim(),
      status: statusFilter.value || undefined
    })
    programs.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error(e)
    programs.value = []
  } finally {
    loading.value = false
  }
}

function scheduleSearchLoad() {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    loadPrograms()
  }, 300)
}

watch(statusFilter, () => {
  loadPrograms()
})

watch(searchQuery, () => {
  scheduleSearchLoad()
})

onMounted(() => {
  loadPrograms()
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

function onCreateProgram() {
  toast.info('Создание рабочих программ будет доступно после подключения API.')
}

const hasFilters = () => Boolean(searchQuery.value.trim() || statusFilter.value)
</script>

<template>
  <RoleGuard
    :roles="['teacher', 'admin']"
    fallback-message="Раздел доступен преподавателям и администраторам"
  >
    <div class="wpc-view container-fluid py-3">
      <div class="wpc-hero">
        <div class="wpc-hero__head">
          <div class="d-flex align-items-start gap-3">
            <div class="rounded-3 bg-primary bg-opacity-10 p-3 text-primary">
              <FileStack :size="32" />
            </div>
            <div>
              <h1 class="wpc-hero__title">
                Конструктор рабочих программ
              </h1>
              <p class="wpc-hero__subtitle text-muted mb-0">
                Рабочие программы дисциплин: разделы, трудоёмкость, статусы согласования и публикации.
                Данные ниже — демонстрационные, для проверки отображения.
              </p>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-primary d-inline-flex align-items-center gap-2"
            @click="onCreateProgram"
          >
            <Plus :size="18" />
            Создать программу
          </button>
        </div>
      </div>

      <div class="wpc-toolbar card mb-4">
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
                  placeholder="Название, шифр, кафедра, автор…"
                  autocomplete="off"
                >
              </div>
            </div>
            <div class="col-12 col-lg-7">
              <span class="form-label small text-muted mb-1 d-block">Статус</span>
              <div class="wpc-filter-pills d-flex flex-wrap gap-2">
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
        class="wpc-skeleton row g-4"
        aria-busy="true"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="col-md-6 col-xl-4"
        >
          <div class="card wpc-program-card">
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
        v-else-if="programs.length === 0"
        class="wpc-empty"
      >
        <ClipboardCheck
          :size="40"
          class="text-muted mb-3 opacity-50"
        />
        <h3 class="h5 mb-2">
          Нет программ по заданным условиям
        </h3>
        <p class="text-muted mb-0 small">
          <template v-if="hasFilters()">
            Измените поиск или фильтр статуса — в демо-наборе есть программы во всех состояниях.
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
          v-for="program in programs"
          :key="program.id"
          class="col-md-6 col-xl-4"
        >
          <div class="card wpc-program-card h-100 shadow-sm">
            <div class="card-body wpc-program-card__body">
              <div class="wpc-program-card__title-row mb-2">
                <div class="min-w-0">
                  <div class="wpc-program-card__code mb-1">
                    {{ program.code }}
                  </div>
                  <h2 class="h6 mb-0 fw-semibold">
                    {{ program.title }}
                  </h2>
                </div>
                <span
                  class="badge flex-shrink-0"
                  :class="statusBadgeClass[program.status] || 'bg-secondary'"
                >
                  {{ statusLabel[program.status] || program.status }}
                </span>
              </div>

              <div class="wpc-meta-line">
                <Building2 :size="16" />
                <span class="text-truncate">{{ program.department }}</span>
              </div>
              <div class="small text-muted mb-2">
                {{ program.semester }}
              </div>

              <div class="wpc-meta-line">
                <Clock :size="16" />
                <span>{{ program.totalHours }} ч. · {{ program.credits }} з.е.</span>
              </div>
              <div class="wpc-meta-line">
                <Calendar :size="16" />
                <span>Обновлено {{ formatUpdated(program.updatedAt) }}</span>
              </div>
              <div class="wpc-meta-line mb-2">
                <User :size="16" />
                <span>{{ program.author }}</span>
              </div>

              <div
                v-if="program.completionPercent != null"
                class="mb-3"
              >
                <div class="d-flex justify-content-between small text-muted mb-1">
                  <span>Заполнение разделов РПД</span>
                  <span>{{ program.completionPercent }}%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="{ width: `${Math.min(100, program.completionPercent)}%` }"
                    :aria-valuenow="program.completionPercent"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>

              <div class="wpc-sections-panel">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary w-100 d-inline-flex align-items-center justify-content-center gap-2"
                  @click="toggleExpanded(program.id)"
                >
                  <template v-if="isExpanded(program.id)">
                    <ChevronUp :size="16" />
                    Свернуть разделы
                  </template>
                  <template v-else>
                    <ChevronDown :size="16" />
                    Разделы ({{ program.sections?.length || 0 }})
                  </template>
                </button>
                <div
                  v-if="isExpanded(program.id) && program.sections?.length"
                  class="mt-2"
                >
                  <div
                    v-for="sec in program.sections"
                    :key="`${program.id}-${sec.order}`"
                    class="wpc-section-row"
                  >
                    <div class="d-flex align-items-start gap-2 min-w-0">
                      <component
                        :is="sectionTypeIcon[sec.type] || Layers"
                        :size="16"
                        class="text-primary flex-shrink-0 mt-1"
                      />
                      <div class="min-w-0">
                        <div class="fw-medium">
                          {{ sec.order }}. {{ sec.title }}
                        </div>
                        <div class="text-muted small">
                          {{ sectionTypeLabel[sec.type] || sec.type }}
                        </div>
                      </div>
                    </div>
                    <span class="text-muted small flex-shrink-0">{{ sec.hours }} ч.</span>
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
