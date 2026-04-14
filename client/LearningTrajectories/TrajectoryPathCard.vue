<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
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

const DESCR_CLAMP_LEN = 220
const STAGE_CHUNK = 6

const descExpanded = ref(false)
const stagesExpanded = ref(false)

const statusMeta = computed(() => {
  const map = {
    active: { label: 'Активна', cls: 'text-bg-success' },
    draft: { label: 'Черновик', cls: 'text-bg-warning' },
    archived: { label: 'Архив', cls: 'text-bg-secondary' }
  }
  return map[props.item.status] || { label: props.item.status || '', cls: 'text-bg-light' }
})

const accentClass = computed(() => {
  const a = props.item.accent || 'primary'
  return `lt-path-card__accent--${a}`
})

const showDescToggle = computed(() =>
  (props.item.description || '').length > DESCR_CLAMP_LEN
)

const descriptionClamped = computed(() =>
  !descExpanded.value && showDescToggle.value
)

const visibleStages = computed(() => {
  const stages = props.item.keyStages || []
  if (stagesExpanded.value || stages.length <= STAGE_CHUNK) return stages
  return stages.slice(0, STAGE_CHUNK)
})

const hiddenStageCount = computed(() => {
  const n = (props.item.keyStages || []).length
  return n > STAGE_CHUNK ? n - STAGE_CHUNK : 0
})

const progressValue = computed(() => {
  const p = props.item.progressPercent
  if (p === undefined || p === null) return null
  return Math.min(100, Math.max(0, Number(p)))
})
</script>

<template>
  <article class="lt-path-card">
    <div class="lt-path-card__accent" :class="accentClass" aria-hidden="true" />
    <div class="lt-path-card__body">
      <div class="lt-path-card__head">
        <h3 class="lt-path-card__title">
          {{ item.title }}
        </h3>
        <div class="lt-path-card__badges">
          <span v-if="item.tag" class="badge rounded-pill bg-light text-dark border">
            {{ item.tag }}
          </span>
          <span v-if="item.status" class="badge rounded-pill" :class="statusMeta.cls">
            {{ statusMeta.label }}
          </span>
        </div>
      </div>

      <div v-if="item.audience" class="lt-path-card__audience">
        {{ item.audience }}
      </div>

      <p
        class="lt-path-card__desc"
        :class="{ 'lt-path-card__desc--clamped': descriptionClamped }"
      >
        {{ item.description }}
      </p>
      <button
        v-if="showDescToggle"
        type="button"
        class="btn btn-link lt-path-card__toggle p-0"
        @click="descExpanded = !descExpanded"
      >
        {{ descExpanded ? 'Свернуть описание' : 'Развернуть описание' }}
      </button>

      <div v-if="progressValue !== null" class="lt-path-card__progress">
        <div
          class="lt-path-card__progress-bar"
          :style="{ width: progressValue + '%' }"
        />
      </div>

      <template v-if="useStages && item.keyStages && item.keyStages.length">
        <div class="lt-path-card__stages-label">
          {{ stageLabel }}
        </div>
        <div class="lt-path-card__chips">
          <span
            v-for="(st, idx) in visibleStages"
            :key="idx"
            class="lt-stage-chip"
          >{{ st }}</span>
        </div>
        <button
          v-if="hiddenStageCount > 0"
          type="button"
          class="btn btn-link lt-path-card__toggle p-0 mt-1"
          @click="stagesExpanded = !stagesExpanded"
        >
          {{ stagesExpanded ? 'Свернуть этапы' : `Ещё этапов: ${hiddenStageCount}` }}
        </button>
      </template>

      <template v-else-if="!useStages && item.context">
        <div class="lt-path-card__context-label">
          {{ contextLabel }}
        </div>
        <p class="lt-path-card__context">
          {{ item.context }}
        </p>
      </template>
    </div>
  </article>
</template>
