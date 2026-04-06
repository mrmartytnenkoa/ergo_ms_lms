<template>
  <div>
    <!-- Фильтры -->
    <div class="row mb-4">
      <div class="col-lg-4">
        <label class="form-label">Выберите курс</label>
        <SearchableCourseSelect
          :model-value="selectedCourseId"
          :search-value="searchQuery"
          :courses="courses"
          :inline-menu="true"
          placeholder="Поиск и выбор курса"
          @update:model-value="$emit('update:selectedCourseId', $event)"
          @update:search-value="$emit('update:searchQuery', $event)"
        />
      </div>
      <div class="col-lg-4">
        <label class="form-label">Категория</label>
        <select :value="selectedCategory" @input="$emit('update:selectedCategory', $event.target.value)" class="form-select">
          <option value="">Все категории</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="col-lg-4">
        <label class="form-label">Формат</label>
        <select :value="selectedFormat" @input="$emit('update:selectedFormat', $event.target.value)" class="form-select">
          <option value="">Все форматы</option>
          <option v-for="format in courseFormats" :key="format.id" :value="format.id">
            {{ format.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Сортировка -->
    <div class="row mb-4">
      <div class="col-lg-6">
        <label class="form-label">Сортировка</label>
        <select :value="selectedSortOption" @input="onSortOptionChange" class="form-select">
          <option value="name:asc">Название (A-Я)</option>
          <option value="name:desc">Название (Я-A)</option>
          <option value="category:asc">Категория (A-Я)</option>
          <option value="category:desc">Категория (Я-A)</option>
          <option value="format:asc">Формат (A-Я)</option>
          <option value="format:desc">Формат (Я-A)</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SearchableCourseSelect from './SearchableCourseSelect.vue'

const props = defineProps({
  selectedCourseId: String,
  searchQuery: String,
  selectedCategory: String,
  selectedFormat: String,
  sortBy: String,
  sortOrder: String,
  courses: Array,
  categories: Array,
  courseFormats: Array
})

const emit = defineEmits(['update:selectedCourseId', 'update:searchQuery', 'update:selectedCategory', 'update:selectedFormat', 'update:sortBy', 'update:sortOrder'])

const selectedSortOption = computed(() => `${props.sortBy || 'name'}:${props.sortOrder || 'asc'}`)

function onSortOptionChange(event) {
  const [sortBy, sortOrder] = String(event.target.value || 'name:asc').split(':')
  emit('update:sortBy', sortBy || 'name')
  emit('update:sortOrder', sortOrder || 'asc')
}
</script>

<style scoped>
/* Центрирование для всех svg иконок */
svg {
  display: inline-block !important;
  vertical-align: middle !important;
}
</style> 