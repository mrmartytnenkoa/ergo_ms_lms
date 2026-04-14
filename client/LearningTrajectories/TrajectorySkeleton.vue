<template>
  <div aria-busy="true" aria-label="Загрузка страницы">
    <div class="lt-skeleton lt-skeleton-hero" />
    <div class="row g-3 mb-4">
      <div v-for="n in 4" :key="'kpi-' + n" class="col-6 col-xl-3">
        <div class="lt-skeleton lt-skeleton-kpi" />
      </div>
    </div>
    <div class="row g-4">
      <div class="col-12 col-lg-7 d-flex flex-column gap-3">
        <div v-for="n in 3" :key="'g-' + n" class="lt-skeleton lt-skeleton-card" />
      </div>
      <div class="col-12 col-lg-5 d-flex flex-column gap-3">
        <div v-for="n in 2" :key="'a-' + n" class="lt-skeleton lt-skeleton-card" />
        <div class="lt-skeleton lt-skeleton-card" style="height: 160px;" />
      </div>
    </div>
  </div>
</template>
