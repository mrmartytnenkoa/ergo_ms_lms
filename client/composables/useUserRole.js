import { ref, computed, readonly } from 'vue'
import { authService } from '@/core/cms/adp/js/authService'

const allowAll = true
const userRole = ref(null)
const userRoles = ref([])
const currentUser = ref(null)
const isLoading = ref(true)

export function useUserRole() {
  // Вычисляемые свойства для проверки ролей
  const isTeacher = computed(() => {
    return Array.isArray(userRoles.value) && userRoles.value.some(role => role.role === 'teacher' && role.is_active)
  })

  const isStudent = computed(() => {
    return Array.isArray(userRoles.value) && userRoles.value.some(role => role.role === 'student' && role.is_active)
  })

  const isAdmin = computed(() => {
    return Array.isArray(userRoles.value) && userRoles.value.some(role => role.role === 'admin' && role.is_active)
  })

  const isModerator = computed(() => {
    return Array.isArray(userRoles.value) && userRoles.value.some(role => role.role === 'moderator' && role.is_active)
  })

  const isApplicant = computed(() => {
    return Array.isArray(userRoles.value) && userRoles.value.some(role => role.role === 'applicant' && role.is_active)
  })

  const isCounselor = computed(() => {
    return Array.isArray(userRoles.value) && userRoles.value.some(role => role.role === 'counselor' && role.is_active)
  })

  const isOrganizer = computed(() => {
    return Array.isArray(userRoles.value) && userRoles.value.some(role => role.role === 'organizer' && role.is_active)
  })

  const isAnalyst = computed(() => {
    return Array.isArray(userRoles.value) && userRoles.value.some(role => role.role === 'analyst' && role.is_active)
  })

  const primaryRole = computed(() => {
    if (!Array.isArray(userRoles.value)) return 'guest'
    const activeRoles = userRoles.value.filter(role => role.is_active)
    return activeRoles.length > 0 ? activeRoles[0].role : 'guest'
  })

  // Проверить, есть ли у пользователя определенная роль
  const hasRole = (roleName) => {
    if (allowAll) return true
    if (!Array.isArray(userRoles.value)) return false
    return userRoles.value.some(role => role.role === roleName && role.is_active)
  }

  // Псевдоним для обратной совместимости
  const canAccessFunction = (functionName) => canAccess(functionName)

  // Функции для проверки прав доступа
  const canAccess = (functionName) => {
    if (allowAll) return true
    const role = primaryRole.value
    
    const permissions = {
      // Преподавательские функции
      'create_course': ['teacher', 'admin'],
      'edit_course': ['teacher', 'admin'],
      'grade_assignments': ['teacher', 'admin'],
      'manage_students': ['teacher', 'admin'],
      'create_tests': ['teacher', 'admin'],
      'view_analytics': ['teacher', 'admin'],
      'teaching_tools': ['teacher', 'admin'],
      
      // Студенческие функции
      'enroll_course': ['student', 'applicant', 'teacher', 'admin'],
      'submit_assignment': ['student', 'applicant'],
      'take_test': ['student', 'applicant'],
      'view_own_grades': ['student', 'applicant'],
      'student_dashboard': ['student', 'applicant', 'teacher', 'admin'],
      
      // Общие функции
      'view_courses': ['student', 'applicant', 'teacher', 'admin', 'guest'],
      'use_forums': ['student', 'applicant', 'teacher', 'admin'],
      'view_calendar': ['student', 'applicant', 'teacher', 'admin', 'counselor', 'organizer'],
      'view_badges': ['student', 'applicant', 'teacher', 'admin'],
      'view_catalog': ['student', 'applicant', 'teacher', 'admin', 'guest'],
      
      // Административные функции
      'manage_users': ['admin'],
      'system_settings': ['admin'],
      'delete_courses': ['admin'],

      // Профориентация — абитуриент
      'view_applicant_profile': ['applicant'],
      'view_diagnostics': ['applicant'],
      'view_educational_route': ['applicant'],
      'view_professional_development': ['applicant'],
      'view_professions': ['applicant'],
      'view_trajectory': ['applicant'],

      // Профориентация — специалист
      'view_gap_analysis': ['counselor'],
      'view_career_calendar': ['counselor', 'organizer'],
      'view_monitoring': ['counselor'],

      // Аналитика
      'view_career_analytics': ['analyst'],
      'view_reports': ['analyst'],

      // Администратор
      'manage_students': ['teacher', 'admin'],
      'view_integrations': ['admin']
    }

    const allowedRoles = permissions[functionName] || []
    return allowedRoles.includes(role)
  }

  // Получить название роли на русском языке
  const getRoleDisplayName = (role) => {
    const roleNames = {
      'student': 'Студент',
      'teacher': 'Преподаватель',
      'admin': 'Администратор',
      'moderator': 'Модератор',
      'guest': 'Гость',
      'applicant': 'Абитуриент',
      'counselor': 'Специалист по профориентации',
      'organizer': 'Организатор мероприятий',
      'analyst': 'Аналитик'
    }
    return roleNames[role] || role
  }

  // Получить цвет для роли
  const getRoleColor = (role) => {
    const roleColors = {
      'student': 'primary',
      'teacher': 'success',
      'admin': 'danger',
      'moderator': 'warning',
      'guest': 'secondary',
      'applicant': 'info',
      'counselor': 'purple',
      'organizer': 'warning',
      'analyst': 'dark'
    }
    return roleColors[role] || 'secondary'
  }

  // Загрузить роли пользователя
  const loadUserRoles = async () => {
    try {
      isLoading.value = true

      const [roles, primaryRoleValue, user] = await Promise.all([
        authService.getUserRoles(),
        authService.getPrimaryRole(),
        authService.getCurrentUser()
      ])

      userRoles.value = Array.isArray(roles) ? roles : []
      userRole.value = primaryRoleValue || 'guest'
      currentUser.value = user || null
    } catch (error) {
      console.error('Ошибка загрузки ролей пользователя:', error)
      if (!Array.isArray(userRoles.value)) userRoles.value = []
      if (!userRole.value) userRole.value = 'guest'
    } finally {
      isLoading.value = false
    }
  }

  const getRoleBasedMenu = () => {
    const role = primaryRole.value

    const menu = [
      { route: 'LMSDashboard', label: 'Дашборд', roles: ['student', 'teacher', 'admin', 'applicant'] },
      { route: 'LMSCatalog', label: 'Каталог курсов', roles: ['student', 'teacher', 'admin', 'applicant', 'guest'] },
      { route: 'LMSForums', label: 'Форумы', roles: ['student', 'teacher', 'admin'] },
      { route: 'LMSCalendar', label: 'Календарь', roles: ['student', 'teacher', 'admin'] },
      { route: 'LMSBadges', label: 'Достижения', roles: ['student', 'teacher', 'admin'] },
      { route: 'LMSCourses', label: 'Мои курсы', roles: ['student', 'teacher', 'admin'] },
      { route: 'LMSAssignments', label: 'Задания', roles: ['student'] },
      { route: 'LMSTests', label: 'Тесты', roles: ['student'] },
      { route: 'LMSGrades', label: 'Оценки', roles: ['student', 'admin', 'teacher'] },
      { route: 'LMSTeaching', label: 'Преподавание', roles: ['teacher', 'admin'] },
      { route: 'LMSLearningTrajectories', label: 'Траектории обучения', roles: ['teacher', 'admin'] },
      { route: 'LMSStudyPlansConstructor', label: 'Конструктор учебных планов', roles: ['teacher', 'admin'] },

      { route: 'LMSApplicantProfile', label: 'Мой профиль', roles: ['applicant'] },
      { route: 'LMSDiagnostics', label: 'Диагностика', roles: ['applicant'] },
      { route: 'LMSEducationalRoute', label: 'Карта маршрута', roles: ['applicant'] },
      { route: 'LMSProfessionalDev', label: 'Проф. развитие', roles: ['applicant'] },
      { route: 'LMSProfessions', label: 'Профессии', roles: ['applicant'] },
      { route: 'LMSTrajectory', label: 'Траектория', roles: ['applicant'] },

      { route: 'LMSGapAnalysis', label: 'Анализ разрывов', roles: ['counselor'] },
      { route: 'LMSCareerCalendar', label: 'Календарь мероприятий', roles: ['counselor', 'organizer'] },
      { route: 'LMSMonitoring', label: 'Мониторинг', roles: ['counselor'] },

      { route: 'LMSCareerAnalytics', label: 'Аналитика', roles: ['analyst'] },
      { route: 'LMSReports', label: 'Отчеты', roles: ['analyst'] },

      { route: 'LMSStudentManagement', label: 'Обучающиеся', roles: ['admin'] },
      { route: 'LMSIntegrations', label: 'Интеграции', roles: ['admin'] }
    ]

    if (allowAll) return menu
    return menu.filter(item => item.roles.includes(role))
  }

  return {
    // Состояние
    userRole: readonly(userRole),
    userRoles: readonly(userRoles),
    currentUser: readonly(currentUser),
    isLoading: readonly(isLoading),
    
    // Вычисляемые свойства
    isTeacher,
    isStudent,
    isAdmin,
    isModerator,
    isApplicant,
    isCounselor,
    isOrganizer,
    isAnalyst,
    primaryRole,
    
    // Методы
    hasRole,
    canAccess,
    canAccessFunction,
    getRoleDisplayName,
    getRoleColor,
    loadUserRoles,
    getRoleBasedMenu
  }
}

// Глобальный экземпляр для использования через приложение
export const globalUserRole = useUserRole()

// Автоматически загружаем роли при инициализации, но только один раз
let rolesLoaded = false
if (!rolesLoaded) {
  rolesLoaded = true
  globalUserRole.loadUserRoles()
} 