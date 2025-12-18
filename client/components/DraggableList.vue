<template>
  <div :class="containerClass">
    <div
      v-for="(item, index) in items"
      :key="getItemKey(item, index)"
      :class="itemClass"
      :data-index="index"
      :draggable="!disabled"
      @dragstart="handleDragStart($event, item, index)"
      @dragover.prevent="handleDragOver($event, index)"
      @dragenter.prevent="handleDragEnter($event, index)"
      @dragleave="handleDragLeave($event, index)"
      @drop.prevent="handleDrop($event, index)"
      @dragend="handleDragEnd"
    >
      <slot :element="item" :index="index" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  itemKey: {
    type: [String, Function],
    default: 'id'
  },
  tag: {
    type: String,
    default: 'div'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  handle: {
    type: String,
    default: null
  },
  group: {
    type: String,
    default: null
  },
  animation: {
    type: Number,
    default: 300
  },
  containerClass: {
    type: String,
    default: ''
  },
  itemClass: {
    type: String,
    default: ''
  },
  ghostClass: {
    type: String,
    default: 'sortable-ghost'
  },
  chosenClass: {
    type: String,
    default: 'sortable-chosen'
  },
  dragClass: {
    type: String,
    default: 'sortable-drag'
  },
  canDrag: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'start', 'end'])

const items = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const draggedIndex = ref(null)
const dragOverIndex = ref(null)
const draggedElement = ref(null)

function getItemKey(item, index) {
  if (typeof props.itemKey === 'function') {
    return props.itemKey(item, index)
  }
  return item[props.itemKey] || index
}

function handleDragStart(event, item, index) {
  if (props.disabled) {
    event.preventDefault()
    return false
  }

  // Проверяем, если есть handle, то разрешаем drag только если клик был на handle
  if (props.handle) {
    const handleElement = event.target.closest(props.handle)
    if (!handleElement) {
      event.preventDefault()
      return false
    }
    
    // Проверяем, не отключен ли handle
    if (handleElement.classList.contains('disabled')) {
      event.preventDefault()
      return false
    }
  }

  // Проверяем через функцию canDrag, если она предоставлена
  if (props.canDrag && typeof props.canDrag === 'function') {
    const canDragResult = props.canDrag(item, index, event)
    if (canDragResult === false) {
      event.preventDefault()
      return false
    }
  }

  draggedIndex.value = index
  draggedElement.value = item

  // Добавляем классы для визуальной обратной связи
  const dragElement = event.currentTarget
  if (dragElement) {
    dragElement.classList.add(props.chosenClass, props.dragClass)
  }
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', index.toString())

  emit('start', { item, index })
}

function handleDragOver(event, index) {
  if (draggedIndex.value === null || draggedIndex.value === index) {
    return
  }

  event.dataTransfer.dropEffect = 'move'
  dragOverIndex.value = index
}

function handleDragEnter(event, index) {
  if (draggedIndex.value === null || draggedIndex.value === index) {
    return
  }

  const targetElement = event.currentTarget
  if (targetElement) {
    // Убираем класс ghost с предыдущего элемента
    const container = targetElement.parentElement
    if (container) {
      const allItems = container.querySelectorAll(`[data-index]`)
      allItems.forEach((el, idx) => {
        if (idx !== index && idx !== draggedIndex.value) {
          el.classList.remove(props.ghostClass)
        }
      })
    }
    
    // Добавляем класс ghost к текущему элементу
    if (!targetElement.classList.contains(props.ghostClass)) {
      targetElement.classList.add(props.ghostClass)
    }
  }
}

function handleDragLeave(event, index) {
  const targetElement = event.currentTarget
  if (!targetElement) return
  
  // Проверяем, действительно ли мы покинули элемент
  const relatedTarget = event.relatedTarget
  if (relatedTarget && targetElement.contains(relatedTarget)) {
    return
  }
  
  // Убираем класс ghost только если мы действительно покинули элемент
  targetElement.classList.remove(props.ghostClass)
  
  if (dragOverIndex.value === index) {
    dragOverIndex.value = null
  }
}

function handleDrop(event, dropIndex) {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    return
  }

  const newItems = [...items.value]
  const [removed] = newItems.splice(draggedIndex.value, 1)
  newItems.splice(dropIndex, 0, removed)

  items.value = newItems

  // Убираем класс ghost с элемента
  const targetElement = event.currentTarget
  if (targetElement) {
    targetElement.classList.remove(props.ghostClass)
  }

  // Эмитим событие change с информацией о перемещении
  emit('change', {
    moved: {
      element: removed,
      oldIndex: draggedIndex.value,
      newIndex: dropIndex
    }
  })

  dragOverIndex.value = null
}

function handleDragEnd(event) {
  // Убираем все классы со всех элементов
  const container = event.currentTarget?.parentElement
  if (container) {
    const allItems = container.querySelectorAll(`[data-index]`)
    if (allItems) {
      allItems.forEach(el => {
        el.classList.remove(props.ghostClass, props.chosenClass, props.dragClass)
      })
    }
  }

  emit('end', {
    oldIndex: draggedIndex.value,
    newIndex: dragOverIndex.value
  })

  draggedIndex.value = null
  dragOverIndex.value = null
  draggedElement.value = null
}
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.4;
  background-color: rgba(13, 110, 253, 0.1) !important;
  border: 2px dashed #0d6efd !important;
}

.sortable-chosen {
  transform: scale(1.01);
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.2) !important;
  z-index: 1000 !important;
}

.sortable-drag {
  transform: rotate(1deg) scale(1.005);
  opacity: 0.95 !important;
}
</style>
