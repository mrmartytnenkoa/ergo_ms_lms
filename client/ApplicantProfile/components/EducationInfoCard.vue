<script setup>
import { computed } from 'vue'
import { School, BookOpen, Layers, GraduationCap } from 'lucide-vue-next'

const props = defineProps({
  profile: { type: Object, required: true }
})

const educationTypeLabel = computed(() => {
  const map = { school: 'Школа', spo: 'СПО', college: 'Колледж', university: 'Университет' }
  return map[props.profile.educationType] || props.profile.educationType || '—'
})

const infoItems = computed(() => [
  { icon: GraduationCap, label: 'Тип образования', value: educationTypeLabel.value },
  { icon: School, label: 'Учебное заведение', value: props.profile.institution },
  { icon: BookOpen, label: 'Класс / профиль', value: props.profile.classProfile },
  { icon: Layers, label: 'Специализация', value: props.profile.specialization }
])
</script>

<template>
  <div class="card h-100">
    <div class="card-header">
      <h6 class="mb-0">Образование</h6>
    </div>
    <div class="card-body">
      <ul class="list-unstyled mb-0">
        <li
          v-for="(item, idx) in infoItems"
          :key="idx"
          class="d-flex align-items-center mb-3"
          :class="{ 'mb-0': idx === infoItems.length - 1 }"
        >
          <component :is="item.icon" :size="18" class="text-muted me-3 flex-shrink-0" />
          <div>
            <small class="text-muted d-block">{{ item.label }}</small>
            <span>{{ item.value || '—' }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
