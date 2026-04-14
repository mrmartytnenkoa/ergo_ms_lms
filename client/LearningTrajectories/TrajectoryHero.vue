<script setup>
import { computed } from 'vue'
import { LayoutTemplate, Briefcase, Activity, Calendar } from 'lucide-vue-next'

const props = defineProps({
  intro: {
    type: String,
    required: true
  },
  stats: {
    type: Object,
    default: null
  }
})

const kpiTiles = computed(() => {
  const s = props.stats
  if (!s) return []
  return [
    {
      key: 'templates',
      label: 'Шаблонов',
      value: s.trajectoryTemplates,
      sub: 'в библиотеке',
      icon: LayoutTemplate
    },
    {
      key: 'employer',
      label: 'С работодателем',
      value: s.employerLinkedPrograms,
      sub: 'программ',
      icon: Briefcase
    },
    {
      key: 'active',
      label: 'Активных маршрутов',
      value: s.activeRoutes ?? '—',
      sub: 'по данным LMS',
      icon: Activity
    },
    {
      key: 'updated',
      label: 'Обновлено',
      value: s.lastUpdated ?? '—',
      sub: 'дата среза',
      icon: Calendar
    }
  ]
})
</script>

<template>
  <div class="lt-hero">
    <div class="lt-hero__head">
      <div class="lt-hero__title-wrap">
        <h1 class="lt-hero__title">
          Траектории обучения
        </h1>
        <button
          type="button"
          class="lt-hero__hint"
          aria-label="Подсказка о траекториях обучения"
        >
          ?
          <span class="lt-hero__tooltip" role="tooltip">
            {{ intro }}
          </span>
        </button>
      </div>
      <div class="lt-hero__actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="kpiTiles.length" class="row g-3 lt-kpi-row">
      <div
        v-for="tile in kpiTiles"
        :key="tile.key"
        class="col-6 col-xl-3"
      >
        <div class="lt-kpi-tile">
          <div class="lt-kpi-tile__icon">
            <component :is="tile.icon" :size="20" />
          </div>
          <div class="flex-grow-1 overflow-hidden" style="min-width: 0;">
            <div class="lt-kpi-tile__label">
              {{ tile.label }}
            </div>
            <div class="lt-kpi-tile__value text-truncate">
              {{ tile.value }}
            </div>
            <div class="lt-kpi-tile__sub">
              {{ tile.sub }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
