<template>
  <!-- Создание категории -->
  <div class="modal fade" :class="{ 'show d-block': showCreateCategory }" tabindex="-1" v-if="showCreateCategory">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Создать категорию</h5>
          <button type="button" class="btn-close" @click="emit('close', 'createCategory')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Название категории *</label>
            <input
              v-model="catForm.name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': catErrors.name }"
              placeholder="Введите название категории"
              @blur="validateCat('name')"
            />
            <div v-if="catErrors.name" class="invalid-feedback">{{ catErrors.name }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Описание</label>
            <textarea
              v-model="catForm.description"
              class="form-control"
              :class="{ 'is-invalid': catErrors.description }"
              rows="3"
              placeholder="Описание категории"
              @blur="validateCat('description')"
            ></textarea>
            <div v-if="catErrors.description" class="invalid-feedback">{{ catErrors.description }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Родительская категория</label>
            <select v-model="catForm.parent" class="form-select">
              <option :value="null">Без родительской категории</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.parent ? '-- ' : '' }}{{ c.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Порядок сортировки</label>
            <input v-model="catForm.sort_order" type="number" class="form-control" placeholder="0" />
            <div class="form-text">Чем меньше число, тем выше в списке</div>
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input v-model="catForm.is_visible" class="form-check-input" type="checkbox" id="catVisibleCreate" />
              <label class="form-check-label" for="catVisibleCreate">Видимая категория</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="emit('close', 'createCategory')" :disabled="submitting">Отмена</button>
          <button type="button" class="btn btn-primary" @click="submitCategory(false)" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ submitting ? 'Создание...' : 'Создать категорию' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showCreateCategory" class="modal-backdrop fade show"></div>

  <!-- Редактирование категории -->
  <div class="modal fade" :class="{ 'show d-block': showEditCategory }" tabindex="-1" v-if="showEditCategory">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center gap-2">
            <Edit :size="20" class="text-primary" />
            Редактировать категорию
          </h5>
          <button type="button" class="btn-close" @click="emit('close', 'editCategory')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Название категории *</label>
            <input
              v-model="catForm.name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': catErrors.name }"
              placeholder="Введите название категории"
              @blur="validateCat('name')"
            />
            <div v-if="catErrors.name" class="invalid-feedback">{{ catErrors.name }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Описание</label>
            <textarea
              v-model="catForm.description"
              class="form-control"
              :class="{ 'is-invalid': catErrors.description }"
              rows="3"
              placeholder="Описание категории"
              @blur="validateCat('description')"
            ></textarea>
            <div v-if="catErrors.description" class="invalid-feedback">{{ catErrors.description }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Родительская категория</label>
            <select v-model="catForm.parent" class="form-select">
              <option :value="null">Без родительской категории</option>
              <option
                v-for="c in categories.filter(c => c.id !== editingCategory?.id)"
                :key="c.id"
                :value="c.id"
              >
                {{ c.parent ? '-- ' : '' }}{{ c.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Порядок сортировки</label>
            <input v-model="catForm.sort_order" type="number" class="form-control" placeholder="0" />
            <div class="form-text">Чем меньше число, тем выше в списке</div>
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input v-model="catForm.is_visible" class="form-check-input" type="checkbox" id="catVisibleEdit" />
              <label class="form-check-label" for="catVisibleEdit">Видимая категория</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="emit('close', 'editCategory')" :disabled="submitting">Отмена</button>
          <button type="button" class="btn btn-primary" @click="submitCategory(true)" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ submitting ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showEditCategory" class="modal-backdrop fade show"></div>

  <!-- Создание формата -->
  <div class="modal fade" :class="{ 'show d-block': showCreateFormat }" tabindex="-1" v-if="showCreateFormat">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Создать формат курса</h5>
          <button type="button" class="btn-close" @click="emit('close', 'createFormat')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Название формата *</label>
            <input
              v-model="fmtForm.name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': fmtErrors.name }"
              placeholder="Введите название формата"
              @blur="validateFmt('name')"
            />
            <div v-if="fmtErrors.name" class="invalid-feedback">{{ fmtErrors.name }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Описание</label>
            <textarea
              v-model="fmtForm.description"
              class="form-control"
              :class="{ 'is-invalid': fmtErrors.description }"
              rows="3"
              placeholder="Описание формата курса"
              @blur="validateFmt('description')"
            ></textarea>
            <div v-if="fmtErrors.description" class="invalid-feedback">{{ fmtErrors.description }}</div>
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input v-model="fmtForm.is_active" class="form-check-input" type="checkbox" id="fmtActiveCreate" />
              <label class="form-check-label" for="fmtActiveCreate">Активный формат</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="emit('close', 'createFormat')" :disabled="submitting">Отмена</button>
          <button type="button" class="btn btn-primary" @click="submitFormat(false)" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ submitting ? 'Создание...' : 'Создать формат' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showCreateFormat" class="modal-backdrop fade show"></div>

  <!-- Редактирование формата -->
  <div class="modal fade" :class="{ 'show d-block': showEditFormat }" tabindex="-1" v-if="showEditFormat">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center gap-2">
            <Edit :size="20" class="text-primary" />
            Редактировать формат курса
          </h5>
          <button type="button" class="btn-close" @click="emit('close', 'editFormat')"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Название формата *</label>
            <input
              v-model="fmtForm.name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': fmtErrors.name }"
              placeholder="Введите название формата"
              @blur="validateFmt('name')"
            />
            <div v-if="fmtErrors.name" class="invalid-feedback">{{ fmtErrors.name }}</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Описание</label>
            <textarea
              v-model="fmtForm.description"
              class="form-control"
              :class="{ 'is-invalid': fmtErrors.description }"
              rows="3"
              placeholder="Описание формата курса"
              @blur="validateFmt('description')"
            ></textarea>
            <div v-if="fmtErrors.description" class="invalid-feedback">{{ fmtErrors.description }}</div>
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input v-model="fmtForm.is_active" class="form-check-input" type="checkbox" id="fmtActiveEdit" />
              <label class="form-check-label" for="fmtActiveEdit">Активный формат</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="emit('close', 'editFormat')" :disabled="submitting">Отмена</button>
          <button type="button" class="btn btn-primary" @click="submitFormat(true)" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ submitting ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showEditFormat" class="modal-backdrop fade show"></div>

  <!-- Подтверждение удаления -->
  <div class="modal fade" :class="{ 'show d-block': showDeleteConfirm }" tabindex="-1" v-if="showDeleteConfirm">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <AlertTriangle :size="20" class="text-danger me-2" />
            Подтверждение удаления
          </h5>
          <button type="button" class="btn-close" @click="emit('close', 'delete')"></button>
        </div>
        <div class="modal-body">
          <p v-if="itemToDelete?.type === 'category'">
            Вы действительно хотите удалить категорию <strong>"{{ itemToDelete?.item?.name }}"</strong>?
            <span v-if="hasChildCategories" class="text-danger">
              <br><br>
              <AlertTriangle :size="16" class="me-1" />
              Внимание! У этой категории есть подкатегории, которые также будут удалены.
            </span>
            <span v-if="itemToDelete?.item?.courses_count > 0" class="text-danger">
              <br><br>
              <AlertTriangle :size="16" class="me-1" />
              В данной категории есть {{ itemToDelete.item.courses_count }} курс(ов).
            </span>
          </p>
          <p v-else>
            Вы действительно хотите удалить формат <strong>"{{ itemToDelete?.item?.name }}"</strong>?
            <span v-if="itemToDelete?.item?.courses_count > 0" class="text-danger">
              <br><br>
              <AlertTriangle :size="16" class="me-1" />
              Данный формат используется в {{ itemToDelete.item.courses_count }} курсе(ах).
            </span>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="emit('close', 'delete')">Отмена</button>
          <button type="button" class="btn btn-danger" :disabled="deleting" @click="emit('confirm-delete')">
            <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showDeleteConfirm" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Edit, AlertTriangle } from 'lucide-vue-next'

const props = defineProps({
  showCreateCategory: Boolean,
  showEditCategory: Boolean,
  showCreateFormat: Boolean,
  showEditFormat: Boolean,
  showDeleteConfirm: Boolean,
  categories: { type: Array, default: () => [] },
  editingCategory: { type: Object, default: null },
  editingFormat: { type: Object, default: null },
  itemToDelete: { type: Object, default: null },
  hasChildCategories: Boolean,
  submitting: Boolean,
  deleting: Boolean
})

const emit = defineEmits(['close', 'save-category', 'save-format', 'confirm-delete'])

const catForm = ref({ name: '', description: '', parent: null, sort_order: 0, is_visible: true })
const fmtForm = ref({ name: '', description: '', is_active: true })
const catErrors = ref({})
const fmtErrors = ref({})

watch(() => props.showCreateCategory, (val) => {
  if (val) resetCatForm()
})

watch(() => props.editingCategory, (cat) => {
  if (cat) {
    catForm.value = {
      name: cat.name,
      description: cat.description || '',
      parent: cat.parent,
      sort_order: cat.sort_order || 0,
      is_visible: cat.is_visible ?? true
    }
    catErrors.value = {}
  }
})

watch(() => props.showCreateFormat, (val) => {
  if (val) resetFmtForm()
})

watch(() => props.editingFormat, (fmt) => {
  if (fmt) {
    fmtForm.value = {
      name: fmt.name,
      description: fmt.description || '',
      is_active: fmt.is_active ?? true
    }
    fmtErrors.value = {}
  }
})

function resetCatForm() {
  catForm.value = { name: '', description: '', parent: null, sort_order: 0, is_visible: true }
  catErrors.value = {}
}

function resetFmtForm() {
  fmtForm.value = { name: '', description: '', is_active: true }
  fmtErrors.value = {}
}

function validateCat(field) {
  const val = catForm.value[field]
  if (field === 'name') {
    if (!val?.trim()) catErrors.value.name = 'Название категории обязательно'
    else if (val.trim().length < 2) catErrors.value.name = 'Минимум 2 символа'
    else if (val.trim().length > 100) catErrors.value.name = 'Максимум 100 символов'
    else delete catErrors.value.name
  }
  if (field === 'description' && val?.length > 500) {
    catErrors.value.description = 'Максимум 500 символов'
  } else if (field === 'description') {
    delete catErrors.value.description
  }
}

function validateFmt(field) {
  const val = fmtForm.value[field]
  if (field === 'name') {
    if (!val?.trim()) fmtErrors.value.name = 'Название формата обязательно'
    else if (val.trim().length < 2) fmtErrors.value.name = 'Минимум 2 символа'
    else if (val.trim().length > 100) fmtErrors.value.name = 'Максимум 100 символов'
    else delete fmtErrors.value.name
  }
  if (field === 'description' && val?.length > 500) {
    fmtErrors.value.description = 'Максимум 500 символов'
  } else if (field === 'description') {
    delete fmtErrors.value.description
  }
}

function submitCategory(isEdit) {
  catErrors.value = {}
  validateCat('name')
  validateCat('description')
  if (Object.keys(catErrors.value).length > 0) return

  emit('save-category', {
    name: catForm.value.name.trim(),
    description: catForm.value.description.trim(),
    parent: catForm.value.parent,
    sort_order: catForm.value.sort_order || 0,
    is_visible: catForm.value.is_visible
  }, isEdit)
}

function submitFormat(isEdit) {
  fmtErrors.value = {}
  validateFmt('name')
  validateFmt('description')
  if (Object.keys(fmtErrors.value).length > 0) return

  emit('save-format', {
    name: fmtForm.value.name.trim(),
    description: fmtForm.value.description.trim(),
    is_active: fmtForm.value.is_active
  }, isEdit)
}

function setServerErrors(type, errors) {
  const target = type === 'category' ? catErrors : fmtErrors
  if (typeof errors === 'object') {
    Object.keys(errors).forEach(field => {
      target.value[field] = Array.isArray(errors[field]) ? errors[field][0] : errors[field]
    })
  }
}

defineExpose({ setServerErrors })
</script>
