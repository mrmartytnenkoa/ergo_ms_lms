<template>
  <div class="row mb-4 g-3">
    <div v-for="item in statItems" :key="item.key" class="col-xl col-md-4 col-6">
      <div class="card border-0 shadow-sm h-100 stat-card">
        <div class="card-body d-flex align-items-center gap-3 py-3">
          <div class="stat-icon-wrapper" :class="`bg-${item.color}-subtle`">
            <component :is="item.icon" :size="20" :class="`text-${item.color}`" />
          </div>
          <div>
            <p class="stat-label text-muted mb-1">{{ item.label }}</p>
            <h4 class="stat-value mb-0">{{ stats[item.key] ?? 0 }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BookOpen, FolderOpen, FileText, Eye, FileCheck, ClipboardList, Paperclip } from 'lucide-vue-next'

defineProps({
  stats: { type: Object, required: true }
})

const statItems = [
  { key: 'totalCourses', label: 'Курсов', icon: BookOpen, color: 'primary' },
  { key: 'totalThemes', label: 'Тем', icon: FolderOpen, color: 'success' },
  { key: 'totalLessons', label: 'Уроков', icon: FileText, color: 'info' },
  { key: 'visibleLessons', label: 'Видимых', icon: Eye, color: 'warning' },
  { key: 'totalTests', label: 'Тестов', icon: FileCheck, color: 'danger' },
  { key: 'totalAssignments', label: 'Заданий', icon: ClipboardList, color: 'secondary' },
  { key: 'totalResources', label: 'Ресурсов', icon: Paperclip, color: 'dark' }
]
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) !important;
}

.stat-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-label {
  font-size: 0.72rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1;
}

.stat-value {
  font-weight: 700;
  font-size: 1.35rem;
  line-height: 1;
}

@media (max-width: 768px) {
  .stat-value {
    font-size: 1.1rem;
  }

  .stat-icon-wrapper {
    width: 36px;
    height: 36px;
  }
}
</style>
