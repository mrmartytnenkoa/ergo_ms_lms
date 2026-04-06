<template>
  <div class="searchable-course-select position-relative">
    <div class="input-group">
      <span class="input-group-text">
        <Search :size="16" />
      </span>
      <input
        ref="inputRef"
        v-model="searchTerm"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': invalid }"
        :placeholder="placeholder"
        @focus="openDropdown"
        @input="handleInput"
      />
      <button
        v-if="modelValue"
        type="button"
        class="btn btn-outline-secondary"
        title="Очистить выбор"
        @click="clearSelection"
      >
        <X :size="14" />
      </button>
    </div>

    <div
      v-if="isOpen"
      :class="menuClasses"
      style="max-height: 220px;"
    >
      <button
        type="button"
        class="dropdown-item searchable-course-item searchable-course-item-clear text-muted"
        @click="clearSelection"
      >
        Очистить выбор
      </button>
      <button
        v-for="course in filteredCourses"
        :key="course.id"
        type="button"
        class="dropdown-item searchable-course-item"
        @click="selectCourse(course)"
      >
        {{ course.name }}
      </button>
      <div
        v-if="filteredCourses.length === 0"
        class="dropdown-item searchable-course-item text-muted"
      >
        Курсы не найдены
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  courses: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Выберите курс'
  },
  invalid: {
    type: Boolean,
    default: false
  },
  inlineMenu: {
    type: Boolean,
    default: false
  },
  searchValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:searchValue'])

const searchTerm = ref('')
const isOpen = ref(false)
const inputRef = ref(null)

const filteredCourses = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()
  if (!query) return props.courses
  return props.courses.filter(course => String(course.name || '').toLowerCase().includes(query))
})

const menuClasses = computed(() => {
  if (props.inlineMenu) {
    return 'searchable-course-menu searchable-course-menu-inline d-block w-100 mt-1 p-0 overflow-auto'
  }
  return 'searchable-course-menu dropdown-menu d-block w-100 mt-1 p-0 overflow-auto'
})

function syncInputWithModel() {
  const selected = props.courses.find(course => String(course.id) === String(props.modelValue))
  if (selected?.name) {
    searchTerm.value = selected.name
    return
  }
  searchTerm.value = props.searchValue || ''
}

function openDropdown() {
  isOpen.value = true
}

function closeDropdown() {
  isOpen.value = false
}

function handleInput() {
  isOpen.value = true
  emit('update:searchValue', searchTerm.value)
  if (!searchTerm.value.trim() && props.modelValue) {
    emit('update:modelValue', null)
  }
}

function selectCourse(course) {
  emit('update:modelValue', course.id)
  emit('update:searchValue', course.name)
  searchTerm.value = course.name
  closeDropdown()
}

function clearSelection() {
  emit('update:modelValue', null)
  emit('update:searchValue', '')
  searchTerm.value = ''
  openDropdown()
  inputRef.value?.focus()
}

function handleDocumentClick(event) {
  if (!inputRef.value) return
  const root = inputRef.value.closest('.searchable-course-select')
  if (!root?.contains(event.target)) {
    closeDropdown()
    syncInputWithModel()
  }
}

watch(() => props.modelValue, syncInputWithModel, { immediate: true })
watch(() => props.courses, syncInputWithModel, { deep: true })
watch(() => props.searchValue, (newValue) => {
  if (!props.modelValue && searchTerm.value !== (newValue || '')) {
    searchTerm.value = newValue || ''
  }
})

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.searchable-course-menu {
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.08);
}

.searchable-course-menu-inline {
  position: relative;
  inset: auto;
  transform: none;
}

.searchable-course-item {
  padding: 0.45rem 0.75rem;
  font-size: 0.92rem;
  line-height: 1.25rem;
  white-space: normal;
}

.searchable-course-item-clear {
  border-bottom: 1px solid var(--bs-border-color, #dee2e6);
}

.searchable-course-item:hover,
.searchable-course-item:focus {
  background-color: var(--bs-secondary-bg, #f8f9fa);
}
</style>
