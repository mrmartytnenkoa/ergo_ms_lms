<script setup>
import TrajectoryPathCard from './TrajectoryPathCard.vue'

defineProps({
  sectionTitle: {
    type: String,
    required: true
  },
  sectionLead: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  useStages: {
    type: Boolean,
    default: true
  },
  stageLabel: {
    type: String,
    default: 'Этапы'
  },
  contextLabel: {
    type: String,
    default: 'Контекст'
  }
})
</script>

<template>
  <section class="lt-section mb-4 mb-lg-0">
    <h2 class="lt-section__title">
      {{ sectionTitle }}
    </h2>
    <p v-if="sectionLead" class="lt-section__lead">
      {{ sectionLead }}
    </p>
    <div class="lt-section__list">
      <TrajectoryPathCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :use-stages="useStages"
        :stage-label="stageLabel"
        :context-label="contextLabel"
      />
    </div>
  </section>
</template>
