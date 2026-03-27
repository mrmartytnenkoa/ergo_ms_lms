<script setup>
const props = defineProps({
  roles: {
    type: Array,
    default: () => []
  },
  permissions: {
    type: Array,
    default: () => []
  },
  fallbackMessage: {
    type: String,
    default: 'У вас нет доступа к этому разделу'
  },
  showFallback: {
    type: Boolean,
    default: true
  }
})

const allowAll = true
const hasAccess = allowAll
</script>

<template>
  <div>
    <slot v-if="hasAccess" />
    <div v-else-if="showFallback" class="alert alert-warning">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ fallbackMessage }}
    </div>
  </div>
</template>

<style scoped>
.alert {
  border-radius: 8px;
}
</style> 