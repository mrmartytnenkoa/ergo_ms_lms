import { ref, computed } from 'vue'
import { lmsService } from '../js/lmsService'
import { showError } from '@/js/utils/notifications'

export function useLessonsData() {
  const courses = ref([])
  const themes = ref([])
  const lessons = ref([])
  const forums = ref([])
  const tests = ref([])
  const assignments = ref([])
  const resources = ref([])
  const categories = ref([])
  const courseFormats = ref([])
  const loading = ref(true)
  
  // Фильтры
  const selectedCourseId = ref('')
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const selectedFormat = ref('')
  const sortBy = ref('name')
  const sortOrder = ref('asc')
  
  const stats = computed(() => ({
    totalCourses: courses.value.length,
    totalThemes: themes.value.length,
    totalLessons: lessons.value.length,
    visibleLessons: lessons.value.filter(l => l.is_visible).length,
    totalTests: tests.value.length,
    totalAssignments: assignments.value.length,
    totalResources: resources.value.length
  }))
  
  const filteredLessons = computed(() => {
    let filtered = lessons.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(lesson =>
        lesson.name.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query)
      )
    }

    return filtered
  })
  
  const groupedData = computed(() => {
    const courseGroups = {}
    
    // Фильтруем курсы
    let filteredCourses = courses.value.filter(course => {
      if (searchQuery.value && !course.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return false
      }
      
      if (selectedCategory.value && course.category?.id !== parseInt(selectedCategory.value)) {
        return false
      }
      
      if (selectedFormat.value && course.course_format?.id !== parseInt(selectedFormat.value)) {
        return false
      }
      
      return true
    })

    // Сортируем курсы
    filteredCourses.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy.value) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'category':
          aValue = a.category?.name?.toLowerCase() || ''
          bValue = b.category?.name?.toLowerCase() || ''
          break
        case 'format':
          aValue = a.course_format?.name?.toLowerCase() || ''
          bValue = b.course_format?.name?.toLowerCase() || ''
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }
      
      if (sortOrder.value === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

    // Создаем группы для отфильтрованных курсов
    filteredCourses.forEach(course => {
      if (!selectedCourseId.value || parseInt(course.id) === parseInt(selectedCourseId.value)) {
        courseGroups[course.id] = {
          course,
          themes: [],
          totalLessons: 0
        }
      }
    })

    // Добавляем темы в соответствующие курсы
    themes.value.forEach(theme => {
      let courseId = theme.subject
      if (typeof courseId === 'object' && courseId?.id) {
        courseId = courseId.id
      }
      courseId = parseInt(courseId)
      
      if (courseGroups[courseId]) {
        courseGroups[courseId].themes.push({
          ...theme,
          lessons: []
        })
      }
    })

    // Добавляем уроки в темы
    filteredLessons.value.forEach(lesson => {
      let themeId = lesson.theme
      if (typeof themeId === 'object' && themeId?.id) {
        themeId = themeId.id
      }
      themeId = parseInt(themeId)
      
      const theme = themes.value.find(t => parseInt(t.id) === themeId)
      if (theme) {
        let courseId = theme.subject
        if (typeof courseId === 'object' && courseId?.id) {
          courseId = courseId.id
        }
        courseId = parseInt(courseId)
        
        const courseGroup = courseGroups[courseId]
        if (courseGroup) {
          const themeInGroup = courseGroup.themes.find(t => parseInt(t.id) === themeId)
          if (themeInGroup) {
            themeInGroup.lessons.push(lesson)
            courseGroup.totalLessons++
          }
        }
      }
    })

    // Сортируем темы и уроки
    Object.values(courseGroups).forEach(group => {
      group.themes.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      group.themes.forEach(theme => {
        theme.lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      })
    })

    return Object.values(courseGroups)
  })
  
  async function loadMockFallback() {
    try {
      const mockModule = await import('../js/mockData.js')
      const mock = mockModule.default.lessonsManagement
      if (!mock) return
      courses.value = mock.courses || []
      themes.value = mock.themes || []
      lessons.value = mock.lessons || []
      forums.value = mock.forums || []
      tests.value = mock.tests || []
      assignments.value = mock.assignments || []
      resources.value = mock.resources || []
      categories.value = mock.categories || []
      courseFormats.value = mock.courseFormats || []
    } catch (e) {
      console.error('Mock fallback load error:', e)
    }
  }

  async function fetchData() {
    try {
      loading.value = true
      
      const data = await lmsService.fetchAllLessonsData()
      
      courses.value = data.courses
      themes.value = data.themes
      lessons.value = data.lessons
      forums.value = data.forums
      tests.value = data.tests
      assignments.value = data.assignments
      resources.value = data.resources
      categories.value = data.categories
      courseFormats.value = data.courseFormats

      if (courses.value.length === 0) {
        await loadMockFallback()
      }
      
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
      await loadMockFallback()
    } finally {
      loading.value = false
    }
  }
  
  function getThemesByCourse(courseId) {
    if (!courseId) return []
    return themes.value.filter(theme => {
      let themeCourseId = theme.subject
      if (typeof themeCourseId === 'object' && themeCourseId?.id) {
        themeCourseId = themeCourseId.id
      }
      return parseInt(themeCourseId) === parseInt(courseId)
    })
  }
  
  function getForumsByCourse(courseId) {
    return forums.value.filter(forum => {
      let forumCourseId = forum.subject
      if (typeof forumCourseId === 'object' && forumCourseId?.id) {
        forumCourseId = forumCourseId.id
      }
      return parseInt(forumCourseId) === parseInt(courseId)
    })
  }
  
  function getLessonsForCourse(courseId, themeId = null) {
    return lessons.value.filter(lesson => {
      let lessonThemeId = lesson.theme
      if (typeof lessonThemeId === 'object' && lessonThemeId?.id) {
        lessonThemeId = lessonThemeId.id
      }
      
      if (themeId) {
        return parseInt(lessonThemeId) === parseInt(themeId)
      }
      
      const theme = themes.value.find(t => t.id === lessonThemeId)
      if (theme) {
        let courseIdFromTheme = theme.subject
        if (typeof courseIdFromTheme === 'object' && courseIdFromTheme?.id) {
          courseIdFromTheme = courseIdFromTheme.id
        }
        return parseInt(courseIdFromTheme) === parseInt(courseId)
      }
      return false
    })
  }
  
  function getThemeNameForLesson(lesson) {
    let themeId = lesson.theme
    if (typeof themeId === 'object' && themeId?.id) {
      themeId = themeId.id
    }
    
    const theme = themes.value.find(t => t.id === themeId)
    return theme ? theme.name : 'Неизвестная тема'
  }

  function getTestsByCourse(courseId) {
    return tests.value.filter(test => {
      // Проверяем прямую привязку к курсу
      if (test.subject) {
        let testCourseId = test.subject
        if (typeof testCourseId === 'object' && testCourseId?.id) {
          testCourseId = testCourseId.id
        }
        if (parseInt(testCourseId) === parseInt(courseId)) {
          return true
        }
      }
      
      // Проверяем привязку через тему
      if (test.theme) {
        let testThemeId = test.theme
        if (typeof testThemeId === 'object' && testThemeId?.id) {
          testThemeId = testThemeId.id
        }
        const theme = themes.value.find(t => parseInt(t.id) === parseInt(testThemeId))
        if (theme) {
          let themeCourseId = theme.subject
          if (typeof themeCourseId === 'object' && themeCourseId?.id) {
            themeCourseId = themeCourseId.id
          }
          if (parseInt(themeCourseId) === parseInt(courseId)) {
            return true
          }
        }
      }
      
      // Проверяем привязку через урок
      if (test.lesson) {
        let testLessonId = test.lesson
        if (typeof testLessonId === 'object' && testLessonId?.id) {
          testLessonId = testLessonId.id
        }
        const lesson = lessons.value.find(l => parseInt(l.id) === parseInt(testLessonId))
        if (lesson) {
          let lessonThemeId = lesson.theme
          if (typeof lessonThemeId === 'object' && lessonThemeId?.id) {
            lessonThemeId = lessonThemeId.id
          }
          const theme = themes.value.find(t => parseInt(t.id) === parseInt(lessonThemeId))
          if (theme) {
            let themeCourseId = theme.subject
            if (typeof themeCourseId === 'object' && themeCourseId?.id) {
              themeCourseId = themeCourseId.id
            }
            if (parseInt(themeCourseId) === parseInt(courseId)) {
              return true
            }
          }
        }
      }
      
      return false
    })
  }

  function getAssignmentsByCourse(courseId) {
    return assignments.value.filter(assignment => {
      // Проверяем прямую привязку к курсу
      if (assignment.subject) {
        let assignmentCourseId = assignment.subject
        if (typeof assignmentCourseId === 'object' && assignmentCourseId?.id) {
          assignmentCourseId = assignmentCourseId.id
        }
        if (parseInt(assignmentCourseId) === parseInt(courseId)) {
          return true
        }
      }
      
      // Проверяем привязку через тему
      if (assignment.theme) {
        let assignmentThemeId = assignment.theme
        if (typeof assignmentThemeId === 'object' && assignmentThemeId?.id) {
          assignmentThemeId = assignmentThemeId.id
        }
        const theme = themes.value.find(t => parseInt(t.id) === parseInt(assignmentThemeId))
        if (theme) {
          let themeCourseId = theme.subject
          if (typeof themeCourseId === 'object' && themeCourseId?.id) {
            themeCourseId = themeCourseId.id
          }
          if (parseInt(themeCourseId) === parseInt(courseId)) {
            return true
          }
        }
      }
      
      // Проверяем привязку через урок
      if (assignment.lesson) {
        let assignmentLessonId = assignment.lesson
        if (typeof assignmentLessonId === 'object' && assignmentLessonId?.id) {
          assignmentLessonId = assignmentLessonId.id
        }
        const lesson = lessons.value.find(l => parseInt(l.id) === parseInt(assignmentLessonId))
        if (lesson) {
          let lessonThemeId = lesson.theme
          if (typeof lessonThemeId === 'object' && lessonThemeId?.id) {
            lessonThemeId = lessonThemeId.id
          }
          const theme = themes.value.find(t => parseInt(t.id) === parseInt(lessonThemeId))
          if (theme) {
            let themeCourseId = theme.subject
            if (typeof themeCourseId === 'object' && themeCourseId?.id) {
              themeCourseId = themeCourseId.id
            }
            if (parseInt(themeCourseId) === parseInt(courseId)) {
              return true
            }
          }
        }
      }
      
      return false
    })
  }

  function getTestsByTheme(themeId) {
    return tests.value.filter(test => {
      // Проверяем прямую привязку к теме
      if (test.theme) {
        let testThemeId = test.theme
        if (typeof testThemeId === 'object' && testThemeId?.id) {
          testThemeId = testThemeId.id
        }
        if (parseInt(testThemeId) === parseInt(themeId)) {
          return true
        }
      }
      
      // Проверяем привязку через урок в этой теме
      if (test.lesson) {
        let testLessonId = test.lesson
        if (typeof testLessonId === 'object' && testLessonId?.id) {
          testLessonId = testLessonId.id
        }
        const lesson = lessons.value.find(l => parseInt(l.id) === parseInt(testLessonId))
        if (lesson) {
          let lessonThemeId = lesson.theme
          if (typeof lessonThemeId === 'object' && lessonThemeId?.id) {
            lessonThemeId = lessonThemeId.id
          }
          if (parseInt(lessonThemeId) === parseInt(themeId)) {
            return true
          }
        }
      }
      
      return false
    })
  }

  function getAssignmentsByTheme(themeId) {
    return assignments.value.filter(assignment => {
      // Проверяем прямую привязку к теме
      if (assignment.theme) {
        let assignmentThemeId = assignment.theme
        if (typeof assignmentThemeId === 'object' && assignmentThemeId?.id) {
          assignmentThemeId = assignmentThemeId.id
        }
        if (parseInt(assignmentThemeId) === parseInt(themeId)) {
          return true
        }
      }
      
      // Проверяем привязку через урок в этой теме
      if (assignment.lesson) {
        let assignmentLessonId = assignment.lesson
        if (typeof assignmentLessonId === 'object' && assignmentLessonId?.id) {
          assignmentLessonId = assignmentLessonId.id
        }
        const lesson = lessons.value.find(l => parseInt(l.id) === parseInt(assignmentLessonId))
        if (lesson) {
          let lessonThemeId = lesson.theme
          if (typeof lessonThemeId === 'object' && lessonThemeId?.id) {
            lessonThemeId = lessonThemeId.id
          }
          if (parseInt(lessonThemeId) === parseInt(themeId)) {
            return true
          }
        }
      }
      
      return false
    })
  }

  function updateThemeOrder(themeIds) {
    console.log('🔄 Обновление порядка тем в исходных данных:', themeIds)
    console.log('🔍 Текущее состояние тем:', themes.value.map(t => ({ id: t.id, name: t.name, sort_order: t.sort_order })))
    
    // Обновляем sort_order в исходном массиве themes
    themeIds.forEach((themeId, index) => {
      const theme = themes.value.find(t => t.id === themeId)
      if (theme) {
        theme.sort_order = index + 1
        console.log(`📝 Обновлен sort_order исходной темы "${theme.name}": ${theme.sort_order}`)
      }
    })
    
    console.log('✅ Порядок тем обновлен в исходных данных')
    console.log('🔍 Новое состояние тем:', themes.value.map(t => ({ id: t.id, name: t.name, sort_order: t.sort_order })))
  }

  function getTestsByLesson(lessonId) {
    return tests.value.filter(test => {
      if (test.lesson) {
        let testLessonId = test.lesson
        if (typeof testLessonId === 'object' && testLessonId?.id) {
          testLessonId = testLessonId.id
        }
        return parseInt(testLessonId) === parseInt(lessonId)
      }
      return false
    }).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  }

  function getAssignmentsByLesson(lessonId) {
    return assignments.value.filter(assignment => {
      if (assignment.lesson) {
        let assignmentLessonId = assignment.lesson
        if (typeof assignmentLessonId === 'object' && assignmentLessonId?.id) {
          assignmentLessonId = assignmentLessonId.id
        }
        return parseInt(assignmentLessonId) === parseInt(lessonId)
      }
      return false
    }).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  }

  function updateLessonOrder(themeId, lessonIds) {
    console.log('🔄 Обновление порядка уроков в исходных данных:', { themeId, lessonIds })
    console.log('🔍 Текущее состояние уроков темы:', lessons.value.filter(l => {
      let lessonThemeId = l.theme
      if (typeof lessonThemeId === 'object' && lessonThemeId?.id) {
        lessonThemeId = lessonThemeId.id
      }
      return parseInt(lessonThemeId) === parseInt(themeId)
    }).map(l => ({ id: l.id, name: l.name, sort_order: l.sort_order })))
    
    // Обновляем sort_order в исходном массиве lessons
    lessonIds.forEach((lessonId, index) => {
      const lesson = lessons.value.find(l => l.id === lessonId)
      if (lesson) {
        lesson.sort_order = index + 1
        console.log(`📝 Обновлен sort_order исходного урока "${lesson.name}": ${lesson.sort_order}`)
      }
    })
    
    console.log('✅ Порядок уроков обновлен в исходных данных')
    console.log('🔍 Новое состояние уроков темы:', lessons.value.filter(l => {
      let lessonThemeId = l.theme
      if (typeof lessonThemeId === 'object' && lessonThemeId?.id) {
        lessonThemeId = lessonThemeId.id
      }
      return parseInt(lessonThemeId) === parseInt(themeId)
    }).map(l => ({ id: l.id, name: l.name, sort_order: l.sort_order })))
  }

  function updateTestOrder(lessonId, testIds) {
    console.log('🔄 Обновление порядка тестов в исходных данных:', { lessonId, testIds })
    console.log('🔍 Текущее состояние тестов урока:', tests.value.filter(t => {
      let testLessonId = t.lesson
      if (typeof testLessonId === 'object' && testLessonId?.id) {
        testLessonId = testLessonId.id
      }
      return parseInt(testLessonId) === parseInt(lessonId)
    }).map(t => ({ id: t.id, name: t.name || t.title, sort_order: t.sort_order })))
    
    // Обновляем sort_order в исходном массиве tests
    testIds.forEach((testId, index) => {
      const test = tests.value.find(t => t.id === testId)
      if (test) {
        test.sort_order = index + 1
        console.log(`📝 Обновлен sort_order исходного теста "${test.name || test.title}": ${test.sort_order}`)
      }
    })
    
    console.log('✅ Порядок тестов обновлен в исходных данных')
    console.log('🔍 Новое состояние тестов урока:', tests.value.filter(t => {
      let testLessonId = t.lesson
      if (typeof testLessonId === 'object' && testLessonId?.id) {
        testLessonId = testLessonId.id
      }
      return parseInt(testLessonId) === parseInt(lessonId)
    }).map(t => ({ id: t.id, name: t.name || t.title, sort_order: t.sort_order })))
  }

  function updateAssignmentOrder(lessonId, assignmentIds) {
    console.log('🔄 Обновление порядка заданий в исходных данных:', { lessonId, assignmentIds })
    console.log('🔍 Текущее состояние заданий урока:', assignments.value.filter(a => {
      let assignmentLessonId = a.lesson
      if (typeof assignmentLessonId === 'object' && assignmentLessonId?.id) {
        assignmentLessonId = assignmentLessonId.id
      }
      return parseInt(assignmentLessonId) === parseInt(lessonId)
    }).map(a => ({ id: a.id, title: a.title, sort_order: a.sort_order })))
    
    // Обновляем sort_order в исходном массиве assignments
    assignmentIds.forEach((assignmentId, index) => {
      const assignment = assignments.value.find(a => a.id === assignmentId)
      if (assignment) {
        assignment.sort_order = index + 1
        console.log(`📝 Обновлен sort_order исходного задания "${assignment.title}": ${assignment.sort_order}`)
      }
    })
    
    console.log('✅ Порядок заданий обновлен в исходных данных')
    console.log('🔍 Новое состояние заданий урока:', assignments.value.filter(a => {
      let assignmentLessonId = a.lesson
      if (typeof assignmentLessonId === 'object' && assignmentLessonId?.id) {
        assignmentLessonId = assignmentLessonId.id
      }
      return parseInt(assignmentLessonId) === parseInt(lessonId)
    }).map(a => ({ id: a.id, title: a.title, sort_order: a.sort_order })))
  }
  
  return {
    // Данные
    courses,
    themes,
    lessons,
    forums,
    tests,
    assignments,
    resources,
    categories,
    courseFormats,
    loading,
    
    // Фильтры
    selectedCourseId,
    searchQuery,
    selectedCategory,
    selectedFormat,
    sortBy,
    sortOrder,
    
    // Вычисляемые свойства
    stats,
    filteredLessons,
    groupedData,
    
    // Методы
    fetchData,
    getThemesByCourse,
    getForumsByCourse,
    getLessonsForCourse,
    getThemeNameForLesson,
    getTestsByCourse,
    getAssignmentsByCourse,
    getTestsByTheme,
    getAssignmentsByTheme,
    getTestsByLesson,
    getAssignmentsByLesson,
    updateThemeOrder,
    updateLessonOrder,
    updateTestOrder,
    updateAssignmentOrder
  }
} 