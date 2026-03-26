<template>
  <div class="row g-3">
    <div class="col-md-4">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body text-center">
          <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 56px; height: 56px;">
            <Users class="text-primary" :size="28" />
          </div>
          <div class="h2 mb-1">{{ coverage.total }}</div>
          <div class="text-muted">Всего учащихся</div>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body text-center">
          <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 56px; height: 56px;">
            <UserCheck class="text-success" :size="28" />
          </div>
          <div class="h2 mb-1">{{ coverage.covered }}</div>
          <div class="text-muted">Охвачено</div>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card border-0 shadow-sm h-100">
        <div class="card-body text-center">
          <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 56px; height: 56px;">
            <Percent class="text-info" :size="28" />
          </div>
          <div class="h2 mb-1">{{ coverage.percentage }}%</div>
          <div class="text-muted">Процент охвата</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Users, UserCheck, Percent } from 'lucide-vue-next'

defineProps({
  coverage: {
    type: Object,
    required: true
  }
})
</script>
