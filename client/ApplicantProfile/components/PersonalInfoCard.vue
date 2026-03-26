<script setup>
import { computed } from 'vue'
import { Mail, Phone, Calendar, MapPin } from 'lucide-vue-next'

const props = defineProps({
  profile: { type: Object, required: true }
})

const fullName = computed(() =>
  [props.profile.lastName, props.profile.firstName, props.profile.middleName].filter(Boolean).join(' ')
)

const formattedBirthDate = computed(() => {
  if (!props.profile.birthDate) return '—'
  return new Date(props.profile.birthDate).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
})

const infoItems = computed(() => [
  { icon: Calendar, label: 'Дата рождения', value: formattedBirthDate.value },
  { icon: Mail, label: 'Email', value: props.profile.email },
  { icon: Phone, label: 'Телефон', value: props.profile.phone },
  { icon: MapPin, label: 'Город', value: props.profile.city },
  { icon: MapPin, label: 'Регион', value: props.profile.region }
])
</script>

<template>
  <div class="card h-100">
    <div class="card-header">
      <h6 class="mb-0">Личные данные</h6>
    </div>
    <div class="card-body">
      <h5 class="mb-3">{{ fullName }}</h5>
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
