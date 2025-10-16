import { ref, computed } from 'vue'
import { lmsService } from '../../js/lmsService'

// Простые функции для уведомлений (временно)
const showSuccess = (message) => {
    console.log('✅ Успех:', message)
    // TODO: Заменить на настоящую систему уведомлений
}

const showError = (message) => {
    console.error('❌ Ошибка:', message)
    // TODO: Заменить на настоящую систему уведомлений
}

export function useLessonItems() {
    const items = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Получение элементов урока
    const fetchLessonItems = async (lessonId) => {
        if (!lessonId) {
            items.value = []
            return
        }

        loading.value = true
        error.value = null

        try {
            const data = await lmsService.getLessonItems(lessonId)
            items.value = data
            console.log('📚 Элементы урока загружены:', data)
        } catch (err) {
            console.error('❌ Ошибка загрузки элементов урока:', err)
            error.value = err.message
            showError('Ошибка загрузки элементов урока')
            items.value = []
        } finally {
            loading.value = false
        }
    }

    // Изменение порядка элементов урока
    const reorderItems = async (reorderData) => {
        loading.value = true

        try {
            console.log('🔄 Изменение порядка элементов урока:', reorderData)

            const data = await lmsService.reorderLessonItems(reorderData)
            console.log('✅ Порядок элементов урока обновлен:', data)
            
            // Обновляем локальные данные
            if (data.items) {
                items.value = data.items
            }
            
            showSuccess('Порядок элементов урока обновлен')
            return data
        } catch (err) {
            console.error('❌ Ошибка изменения порядка элементов урока:', err)
            showError(`Ошибка изменения порядка: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Миграция существующих элементов
    const migrateExistingItems = async () => {
        loading.value = true

        try {
            console.log('🔄 Миграция существующих элементов...')

            const data = await lmsService.migrateLessonItems()
            console.log('✅ Миграция завершена:', data)
            
            showSuccess(`Миграция завершена. Создано ${data.created_count} записей`)
            return data
        } catch (err) {
            console.error('❌ Ошибка миграции:', err)
            showError(`Ошибка миграции: ${err.message}`)
            throw err
        } finally {
            loading.value = false
        }
    }

    // Группировка элементов по типу (для отладки/анализа)
    const itemsByType = computed(() => {
        const grouped = {
            tests: [],
            assignments: [],
            resources: []
        }

        items.value.forEach(item => {
            switch (item.item_type) {
                case 'test':
                    grouped.tests.push(item)
                    break
                case 'assignment':
                    grouped.assignments.push(item)
                    break
                case 'resource':
                    grouped.resources.push(item)
                    break
            }
        })

        return grouped
    })

    // Статистика элементов
    const itemsStats = computed(() => ({
        total: items.value.length,
        tests: items.value.filter(item => item.item_type === 'test').length,
        assignments: items.value.filter(item => item.item_type === 'assignment').length,
        resources: items.value.filter(item => item.item_type === 'resource').length
    }))

    // Очистка данных
    const clearItems = () => {
        items.value = []
        error.value = null
    }

    return {
        // Данные
        items,
        loading,
        error,
        itemsByType,
        itemsStats,

        // Методы
        fetchLessonItems,
        reorderItems,
        migrateExistingItems,
        clearItems
    }
} 