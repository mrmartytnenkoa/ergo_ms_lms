<template>
  <div class="categories-formats-view container-fluid px-4 py-3">
    <RoleGuard :roles="['admin', 'teacher']">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 class="h3 mb-1 text-gray-800">Управление структурой курсов</h1>
          <p class="text-muted mb-0">Категории и форматы обучения</p>
        </div>
      </div>

      <!-- Stat-карточки -->
      <div class="row g-3 mb-4">
        <div class="col-6 col-md-3" v-for="stat in stats" :key="stat.label">
          <div class="stat-card card border-0 shadow-sm h-100">
            <div class="card-body d-flex align-items-center gap-3 py-3 px-3">
              <div class="stat-icon-wrapper" :class="`bg-${stat.variant} bg-opacity-10`">
                <component :is="stat.icon" :size="20" :class="`text-${stat.variant}`" />
              </div>
              <div>
                <div class="stat-label text-muted">{{ stat.label }}</div>
                <div class="stat-value">{{ stat.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter-tabs -->
      <ul class="nav filter-tabs border-bottom mb-4">
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'categories' }"
            @click="activeTab = 'categories'"
          >
            <FolderPlus :size="16" class="me-1" />
            Категории
            <span class="badge bg-primary bg-opacity-10 text-primary ms-1">{{ categories.length }}</span>
          </button>
        </li>
        <li class="nav-item">
          <button
            class="nav-link"
            :class="{ active: activeTab === 'formats' }"
            @click="activeTab = 'formats'"
          >
            <Tag :size="16" class="me-1" />
            Форматы
            <span class="badge bg-success bg-opacity-10 text-success ms-1">{{ courseFormats.length }}</span>
          </button>
        </li>
      </ul>

      <!-- Вкладка категорий -->
      <div v-show="activeTab === 'categories'">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
          <div class="search-input input-group" style="max-width: 300px;">
            <span class="input-group-text"><Search :size="16" /></span>
            <input v-model="categorySearchQuery" type="text" class="form-control" placeholder="Поиск категории..." />
          </div>
          <select v-model="categoryVisibilityFilter" class="form-select" style="max-width: 200px;">
            <option value="">Все</option>
            <option value="visible">Видимые</option>
            <option value="hidden">Скрытые</option>
          </select>
          <select v-model="categorySortBy" class="form-select" style="max-width: 220px;">
            <option value="name">По названию</option>
            <option value="sort_order">По порядку</option>
            <option value="courses_count">По кол-ву курсов</option>
          </select>
          <button class="btn btn-primary ms-auto" @click="openCreateCategory">
            <Plus :size="16" class="me-1" />Создать
          </button>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Загрузка...</span></div>
        </div>

        <div v-else-if="filteredCategories.length === 0" class="empty-state">
          <FolderPlus :size="48" class="mb-3 opacity-50" />
          <p v-if="categorySearchQuery || categoryVisibilityFilter" class="mb-2">Категории не найдены</p>
          <p v-else class="mb-2">Пока нет категорий</p>
          <button v-if="categorySearchQuery || categoryVisibilityFilter" class="btn btn-outline-primary btn-sm" @click="resetCategoryFilters">Сбросить фильтры</button>
        </div>

        <div v-else class="category-tree">
          <CategoryTreeItem
            v-for="cat in categoryTree"
            :key="cat.id"
            :category="cat"
            :categories="categories"
            :filteredCategories="filteredCategories"
            :searchQuery="categorySearchQuery"
            @edit="editCategory"
            @delete="deleteCategory"
          />
        </div>
      </div>

      <!-- Вкладка форматов -->
      <div v-show="activeTab === 'formats'">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
          <div class="search-input input-group" style="max-width: 300px;">
            <span class="input-group-text"><Search :size="16" /></span>
            <input v-model="formatSearchQuery" type="text" class="form-control" placeholder="Поиск формата..." />
          </div>
          <select v-model="formatActiveFilter" class="form-select" style="max-width: 200px;">
            <option value="">Все</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
          </select>
          <select v-model="formatSortBy" class="form-select" style="max-width: 220px;">
            <option value="name">По названию</option>
            <option value="courses_count">По кол-ву курсов</option>
          </select>
          <button class="btn btn-primary ms-auto" @click="openCreateFormat">
            <Plus :size="16" class="me-1" />Создать
          </button>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Загрузка...</span></div>
        </div>

        <div v-else-if="filteredFormats.length === 0" class="empty-state">
          <Tag :size="48" class="mb-3 opacity-50" />
          <p v-if="formatSearchQuery || formatActiveFilter" class="mb-2">Форматы не найдены</p>
          <p v-else class="mb-2">Пока нет форматов</p>
          <button v-if="formatSearchQuery || formatActiveFilter" class="btn btn-outline-primary btn-sm" @click="resetFormatFilters">Сбросить фильтры</button>
        </div>

        <div v-else class="row g-3">
          <div class="col-12 col-md-6 col-lg-4" v-for="fmt in filteredFormats" :key="fmt.id">
            <div class="format-card">
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline-primary" @click="editFormat(fmt)" title="Редактировать">
                  <Edit :size="14" />
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteFormat(fmt)" title="Удалить">
                  <Trash2 :size="14" />
                </button>
              </div>
              <div class="d-flex align-items-start gap-3 mb-3">
                <div class="format-icon bg-primary bg-opacity-10">
                  <component :is="getFormatIcon(fmt.icon)" :size="22" class="text-primary" />
                </div>
                <div>
                  <h6 class="mb-1">{{ fmt.name }}</h6>
                  <p class="text-muted small mb-0">{{ fmt.description || 'Нет описания' }}</p>
                </div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-info bg-opacity-10 text-info">{{ fmt.courses_count || 0 }} курсов</span>
                <span class="status-badge" :class="fmt.is_active ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'">
                  {{ fmt.is_active ? 'Активный' : 'Неактивный' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>

    <CategoriesFormatsModals
      ref="modalsRef"
      :showCreateCategory="showCreateCategoryModal"
      :showEditCategory="showEditCategoryModal"
      :showCreateFormat="showCreateFormatModal"
      :showEditFormat="showEditFormatModal"
      :showDeleteConfirm="showDeleteConfirmModal"
      :categories="categories"
      :editingCategory="editingCategory"
      :editingFormat="editingFormat"
      :itemToDelete="itemToDelete"
      :hasChildCategories="hasChildCategories"
      :submitting="isSubmitting"
      :deleting="isDeleting"
      @close="handleModalClose"
      @save-category="handleSaveCategory"
      @save-format="handleSaveFormat"
      @confirm-delete="handleConfirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  FolderPlus, Tag, Plus, Edit, Trash2, Search,
  BookOpen, GitBranch,
  Wifi, Laptop, School, UserCog, Zap, Video
} from 'lucide-vue-next'
import { apiClient } from '@/js/api/manager'
import { endpoints } from '@/js/api/endpoints'
import { showSuccess, showError } from '@/js/utils/notifications'
import { lmsApi } from '../js/lmsApi'
import RoleGuard from '../components/RoleGuard.vue'
import CategoryTreeItem from './CategoryTreeItem.vue'
import CategoriesFormatsModals from './CategoriesFormatsModals.vue'
import './categories-formats.scss'

const activeTab = ref('categories')
const loading = ref(true)
const categories = ref([])
const courseFormats = ref([])

const showCreateCategoryModal = ref(false)
const showCreateFormatModal = ref(false)
const showEditCategoryModal = ref(false)
const showEditFormatModal = ref(false)
const showDeleteConfirmModal = ref(false)

const editingCategory = ref(null)
const editingFormat = ref(null)
const itemToDelete = ref(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const modalsRef = ref(null)

const categorySearchQuery = ref('')
const categoryVisibilityFilter = ref('')
const categorySortBy = ref('name')
const formatSearchQuery = ref('')
const formatActiveFilter = ref('')
const formatSortBy = ref('name')

const formatIconMap = { Wifi, Laptop, School, UserCog, Zap, Video }

function getFormatIcon(iconName) {
  return formatIconMap[iconName] || Tag
}

const stats = computed(() => {
  const totalCourses = categories.value.reduce((sum, c) => sum + (c.courses_count || 0), 0)
  const subCategories = categories.value.filter(c => c.parent).length
  return [
    { label: 'Категорий', value: categories.value.length, icon: FolderPlus, variant: 'primary' },
    { label: 'Форматов', value: courseFormats.value.length, icon: Tag, variant: 'success' },
    { label: 'Курсов в категориях', value: totalCourses, icon: BookOpen, variant: 'warning' },
    { label: 'Подкатегорий', value: subCategories, icon: GitBranch, variant: 'info' }
  ]
})

const filteredCategories = computed(() => {
  let filtered = [...categories.value]

  if (categoryVisibilityFilter.value) {
    const isVisible = categoryVisibilityFilter.value === 'visible'
    filtered = filtered.filter(c => c.is_visible === isVisible)
  }

  if (categorySearchQuery.value) {
    const q = categorySearchQuery.value.toLowerCase()
    const matched = filtered.filter(c =>
      c.name.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q))
    )
    const ids = new Set(matched.map(c => c.id))
    matched.forEach(c => {
      let parentId = c.parent
      while (parentId) {
        ids.add(parentId)
        const parent = categories.value.find(p => p.id === parentId)
        parentId = parent?.parent || null
      }
    })
    filtered = categories.value.filter(c => ids.has(c.id))
  }

  filtered.sort((a, b) => {
    if (categorySortBy.value === 'name') return a.name.localeCompare(b.name)
    if (categorySortBy.value === 'sort_order') return (a.sort_order || 0) - (b.sort_order || 0)
    if (categorySortBy.value === 'courses_count') return (b.courses_count || 0) - (a.courses_count || 0)
    return 0
  })

  return filtered
})

const categoryTree = computed(() => {
  return filteredCategories.value.filter(c => !c.parent || !filteredCategories.value.find(fc => fc.id === c.parent))
})

const filteredFormats = computed(() => {
  let filtered = [...courseFormats.value]

  if (formatSearchQuery.value) {
    const q = formatSearchQuery.value.toLowerCase()
    filtered = filtered.filter(f =>
      f.name.toLowerCase().includes(q) || (f.description && f.description.toLowerCase().includes(q))
    )
  }

  if (formatActiveFilter.value === 'active') filtered = filtered.filter(f => f.is_active)
  else if (formatActiveFilter.value === 'inactive') filtered = filtered.filter(f => !f.is_active)

  filtered.sort((a, b) => {
    if (formatSortBy.value === 'name') return a.name.localeCompare(b.name)
    if (formatSortBy.value === 'courses_count') return (b.courses_count || 0) - (a.courses_count || 0)
    return 0
  })

  return filtered
})

const hasChildCategories = computed(() => {
  if (itemToDelete.value?.type !== 'category') return false
  return categories.value.some(c => c.parent === itemToDelete.value.item.id)
})

async function fetchData() {
  loading.value = true
  try {
    const data = await lmsApi.getCategoriesAndFormats()
    categories.value = data.categories
    courseFormats.value = data.formats
  } catch (e) {
    console.error('Ошибка загрузки данных:', e)
    showError('Не удалось загрузить данные')
  } finally {
    loading.value = false
  }
}

function resetCategoryFilters() {
  categorySearchQuery.value = ''
  categoryVisibilityFilter.value = ''
}

function resetFormatFilters() {
  formatSearchQuery.value = ''
  formatActiveFilter.value = ''
}

function openCreateCategory() {
  editingCategory.value = null
  showCreateCategoryModal.value = true
}

function openCreateFormat() {
  editingFormat.value = null
  showCreateFormatModal.value = true
}

function editCategory(category) {
  editingCategory.value = category
  showEditCategoryModal.value = true
}

function editFormat(format) {
  editingFormat.value = format
  showEditFormatModal.value = true
}

function deleteCategory(category) {
  itemToDelete.value = { type: 'category', item: category }
  showDeleteConfirmModal.value = true
}

function deleteFormat(format) {
  itemToDelete.value = { type: 'format', item: format }
  showDeleteConfirmModal.value = true
}

function handleModalClose(type) {
  if (type === 'createCategory') showCreateCategoryModal.value = false
  else if (type === 'editCategory') { showEditCategoryModal.value = false; editingCategory.value = null }
  else if (type === 'createFormat') showCreateFormatModal.value = false
  else if (type === 'editFormat') { showEditFormatModal.value = false; editingFormat.value = null }
  else if (type === 'delete') { showDeleteConfirmModal.value = false; itemToDelete.value = null }
}

async function handleSaveCategory(data, isEdit) {
  isSubmitting.value = true
  try {
    if (isEdit) {
      await apiClient.put(`${endpoints.lms.categories}${editingCategory.value.id}/`, data)
      showSuccess('Категория обновлена')
      showEditCategoryModal.value = false
      editingCategory.value = null
    } else {
      await apiClient.post(endpoints.lms.categories, data)
      showSuccess('Категория создана')
      showCreateCategoryModal.value = false
    }
    await fetchData()
  } catch (error) {
    if (error.response?.data) modalsRef.value?.setServerErrors('category', error.response.data)
    else showError('Ошибка сохранения категории')
  } finally {
    isSubmitting.value = false
  }
}

async function handleSaveFormat(data, isEdit) {
  isSubmitting.value = true
  try {
    if (isEdit) {
      await apiClient.put(`${endpoints.lms.courseFormats}${editingFormat.value.id}/`, data)
      showSuccess('Формат обновлен')
      showEditFormatModal.value = false
      editingFormat.value = null
    } else {
      await apiClient.post(endpoints.lms.courseFormats, data)
      showSuccess('Формат создан')
      showCreateFormatModal.value = false
    }
    await fetchData()
  } catch (error) {
    if (error.response?.data) modalsRef.value?.setServerErrors('format', error.response.data)
    else showError('Ошибка сохранения формата')
  } finally {
    isSubmitting.value = false
  }
}

async function handleConfirmDelete() {
  if (!itemToDelete.value) return
  isDeleting.value = true
  try {
    if (itemToDelete.value.type === 'category') {
      await apiClient.delete(`${endpoints.lms.categories}${itemToDelete.value.item.id}/`)
      showSuccess('Категория удалена')
    } else {
      await apiClient.delete(`${endpoints.lms.courseFormats}${itemToDelete.value.item.id}/`)
      showSuccess('Формат удален')
    }
    showDeleteConfirmModal.value = false
    itemToDelete.value = null
    await fetchData()
  } catch (error) {
    showError('Ошибка удаления')
  } finally {
    isDeleting.value = false
  }
}

onMounted(fetchData)
</script>
