<template>
  <div class="category-card">
    <div class="action-buttons">
      <button class="btn btn-sm btn-outline-primary" @click="$emit('edit', category)" title="Редактировать">
        <Edit :size="14" />
      </button>
      <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', category)" title="Удалить">
        <Trash2 :size="14" />
      </button>
    </div>

    <div class="d-flex align-items-center gap-3">
      <button
        v-if="hasChildren"
        class="btn btn-sm btn-link p-0 text-muted"
        @click="toggleExpanded"
      >
        <ChevronDown v-if="isExpanded" :size="18" />
        <ChevronRight v-else :size="18" />
      </button>
      <span v-else style="width: 18px; display: inline-block;"></span>

      <div class="category-icon-circle" :class="`bg-${category.color || 'primary'} bg-opacity-10`">
        <component :is="getIcon(category.icon)" :size="18" :class="`text-${category.color || 'primary'}`" />
      </div>

      <div class="flex-grow-1">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <strong v-html="highlightText(category.name)"></strong>
          <span class="badge bg-info bg-opacity-10 text-info" style="font-size: 0.7rem;">
            {{ category.courses_count || 0 }} курсов
          </span>
          <span
            class="badge"
            :class="category.is_visible ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'"
            style="font-size: 0.7rem;"
          >
            {{ category.is_visible ? 'Видимая' : 'Скрытая' }}
          </span>
        </div>
        <small v-if="category.description" class="text-muted" v-html="highlightText(category.description)"></small>
      </div>
    </div>

    <div v-if="hasChildren && isExpanded" class="category-children">
      <CategoryTreeItem
        v-for="child in children"
        :key="child.id"
        :category="child"
        :categories="categories"
        :filteredCategories="filteredCategories"
        :searchQuery="searchQuery"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ChevronRight, ChevronDown, Edit, Trash2,
  Code, Calculator, Globe, Briefcase, Palette,
  Terminal, Grid3x3, BookOpen, Figma, FolderPlus
} from 'lucide-vue-next'

const props = defineProps({
  category: { type: Object, required: true },
  categories: { type: Array, required: true },
  filteredCategories: { type: Array, default: () => [] },
  searchQuery: { type: String, default: '' }
})

defineEmits(['edit', 'delete'])

const isExpanded = ref(true)

const iconMap = { Code, Calculator, Globe, Briefcase, Palette, Terminal, Grid3x3, BookOpen, Figma }

function getIcon(name) {
  return iconMap[name] || FolderPlus
}

const children = computed(() => {
  const list = props.filteredCategories.length > 0 ? props.filteredCategories : props.categories
  return list.filter(c => c.parent === props.category.id)
})

const hasChildren = computed(() => children.value.length > 0)

function highlightText(text) {
  if (!props.searchQuery || !text) return text
  const q = props.searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${q})`, 'gi'), '<mark class="search-highlight">$1</mark>')
}

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}
</script>
