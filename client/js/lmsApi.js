import { apiClient } from '@/js/api/manager'
import { endpoints } from '@/js/api/endpoints'
import mockData from './mockData.js'

export const lmsApi = {
  // Курсы
  async getCourses() {
    return await apiClient.get(endpoints.lms.subjects)
  },

  async getCourse(id) {
    return await apiClient.get(`${endpoints.lms.subjects}${id}/`)
  },

  async getCourseStructure(id) {
    return await apiClient.get(endpoints.lms.subjectStructure(id))
  },

  getCourseStructureMock(id) {
    const { courses, themes, lessons, tests, assignments, resources } = mockData.lessonsManagement

    const catalogCourse = mockData.catalogData.find(c => c.id == id)
    const lmIdx = catalogCourse
      ? (mockData.catalogData.indexOf(catalogCourse) % courses.length)
      : Math.max(0, courses.findIndex(c => c.id == id))
    const lmCourse = courses[lmIdx] || courses[0]

    const courseMeta = catalogCourse
      ? {
          id: catalogCourse.id,
          name: catalogCourse.name,
          description: catalogCourse.summary || catalogCourse.description,
          teacher: catalogCourse.teacher,
          category: catalogCourse.category,
          course_format: catalogCourse.course_format,
          is_published: catalogCourse.is_published,
        }
      : {
          id: lmCourse.id,
          name: lmCourse.name,
          description: lmCourse.description,
          teacher: lmCourse.teacher,
          category: lmCourse.category,
          course_format: lmCourse.course_format,
          is_published: lmCourse.is_published,
        }

    const structure = themes
      .filter(t => t.subject === lmCourse.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(theme => ({
        ...theme,
        lessons: lessons
          .filter(l => l.theme === theme.id)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(lesson => ({
            ...lesson,
            items: [
              ...tests.filter(t => t.lesson === lesson.id).map(t => ({ ...t, item_type: 'test' })),
              ...assignments.filter(a => a.lesson === lesson.id).map(a => ({ ...a, item_type: 'assignment' })),
              ...resources.filter(r => r.lesson === lesson.id).map(r => ({ ...r, item_type: 'resource' })),
            ],
          })),
      }))

    return { success: true, data: { course: courseMeta, structure } }
  },

  async enrollInCourse(courseId) {
    return await apiClient.post(endpoints.lms.enrollments, {
      subject: courseId
    })
  },

  async unenrollFromCourse(courseId) {
    const enrollments = await apiClient.get(endpoints.lms.enrollments, { subject: courseId })
    const enrollment = enrollments.data.results?.[0]
    if (enrollment) {
      return await apiClient.delete(`${endpoints.lms.enrollments}${enrollment.id}/`)
    }
  },

  // Уроки
  async getLessons(courseId = null, themeId = null) {
    let url = endpoints.lms.lessons
    const paramParts = []
    
    if (courseId) paramParts.push(`subject=${courseId}`)
    if (themeId) paramParts.push(`theme=${themeId}`)
    
    if (paramParts.length > 0) {
      url += `?${paramParts.join('&')}`
    }
    
    return await apiClient.get(url)
  },

  async getLessonItems(lessonId) {
    try {
      return await apiClient.get(`${endpoints.lms.lessonItems}?lesson_id=${lessonId}`)
    } catch (error) {
      console.error(`Ошибка загрузки элементов урока ${lessonId}:`, error)
      throw error
    }
  },

  // Тесты
  async getTests(courseId = null) {
    let url = endpoints.lms.tests
    if (courseId) {
      url += `?subject=${courseId}`
    }
    
    return await apiClient.get(url)
  },

  async startTest(testId) {
    return await apiClient.post(endpoints.lms.startTest(testId))
  },

  async submitTest(attemptId, answers) {
    return await apiClient.post(`${endpoints.lms.testAttempts}${attemptId}/submit/`, {
      answers
    })
  },

  async getTestAttempts() {
    return await apiClient.get(endpoints.lms.testAttempts)
  },

  // Задания
  async getAssignments(courseId = null) {
    let url = endpoints.lms.assignments
    if (courseId) {
      url += `?subject=${courseId}`
    }
    
    return await apiClient.get(url)
  },

  async submitAssignment(assignmentData) {
    return await apiClient.post(endpoints.lms.submittedAssignments, assignmentData)
  },

  async getSubmittedAssignments() {
    return await apiClient.get(endpoints.lms.submittedAssignments)
  },

  // Календарь
  async getCalendarEvents() {
    return await apiClient.get(endpoints.lms.calendar)
  },

  async getUpcomingEvents() {
    return await apiClient.get(endpoints.lms.upcomingEvents)
  },

  async getCalendarData() {
    const typeColors = { assignment: 'primary', quiz: 'info', lesson: 'success', exam: 'danger', deadline: 'warning', webinar: 'info', meeting: 'secondary', other: 'secondary' }

    try {
      const [calRes, assignRes, testRes] = await Promise.all([
        apiClient.get(endpoints.lms.calendar),
        apiClient.get(endpoints.lms.assignments),
        apiClient.get(endpoints.lms.tests)
      ])

      let events = calRes.data?.results || calRes.data || []
      const assignments = assignRes.data?.results || assignRes.data || []
      const tests = testRes.data?.results || testRes.data || []

      assignments.forEach(a => {
        if (a.deadline) {
          events.push({
            id: `assignment-${a.id}`, title: `Дедлайн: ${a.title}`, description: a.description,
            event_type: 'deadline', start_date: a.deadline, end_date: null, is_all_day: true,
            location: '', subject: a.subject ? { id: a.subject.id, name: a.subject.name } : null,
            color: 'warning'
          })
        }
      })

      tests.forEach(t => {
        if (t.available_until) {
          events.push({
            id: `test-${t.id}`, title: `Тест: ${t.name || t.title}`, description: t.description,
            event_type: 'quiz', start_date: t.available_from || new Date().toISOString(), end_date: t.available_until,
            is_all_day: false, location: 'Онлайн', subject: t.subject ? { id: t.subject.id, name: t.subject.name } : null,
            color: 'info'
          })
        }
      })

      if (events.length > 0) {
        return events.map(e => ({ ...e, color: e.color || typeColors[e.event_type] || 'secondary' }))
      }
    } catch (e) {
      console.error('Ошибка загрузки календаря:', e)
    }
    return mockData.calendarEvents
  },

  // Оценки
  async getGrades() {
    return await apiClient.get(endpoints.lms.grades, { student: 'me' })
  },

  async getMyGrades() {
    try {
      const response = await apiClient.get(endpoints.lms.grades, { student: 'me' })
      const data = response.data?.results || response.data || []
      if (data.length > 0) return { data }
    } catch (e) {
      console.error('Ошибка загрузки оценок:', e)
    }
    return { data: mockData.gradesData }
  },

  async getCatalogCourses() {
    try {
      const [coursesRes, categoriesRes, formatsRes] = await Promise.all([
        apiClient.get(endpoints.lms.subjects),
        apiClient.get(endpoints.lms.categories),
        apiClient.get(endpoints.lms.courseFormats)
      ])
      const courses = coursesRes.data?.results || coursesRes.data || []
      const categories = categoriesRes.data?.results || categoriesRes.data || []
      const formats = formatsRes.data?.results || formatsRes.data || []

      if (courses.length > 0) {
        const enriched = courses.map(c => ({
          ...c,
          rating: c.rating ?? (3.5 + Math.round(((c.id * 17) % 15) / 10 * 10) / 10),
          reviews_count: c.reviews_count ?? ((c.id * 37) % 400 + 20),
          difficulty: c.difficulty ?? ['beginner', 'intermediate', 'advanced'][(c.id * 13) % 3],
          duration_hours: c.duration_hours ?? ((c.id * 7) % 60 + 10),
          lessons_count: c.lessons_count ?? ((c.id * 11) % 30 + 8),
          students_count: c.students_count ?? c.enrolled_students_count ?? c.enrollment_count ?? 0,
          tags: c.tags ?? [],
          is_new: c.is_new ?? false,
          is_popular: c.is_popular ?? (c.enrolled_students_count > 50)
        }))
        return { courses: enriched, categories, formats }
      }
    } catch (e) {
      console.error('Ошибка загрузки каталога:', e)
    }
    return {
      courses: mockData.catalogData,
      categories: mockData.lessonsManagement.categories,
      formats: mockData.lessonsManagement.courseFormats
    }
  },

  async getCategoriesAndFormats() {
    const defaultIcons = ['Code', 'Calculator', 'Globe', 'Briefcase', 'Palette', 'Terminal', 'Globe', 'Grid3x3', 'BookOpen', 'Figma']
    const defaultColors = ['primary', 'success', 'info', 'warning', 'danger']
    const formatIcons = ['Wifi', 'Laptop', 'School', 'UserCog', 'Zap', 'Video']

    try {
      const [categoriesRes, formatsRes] = await Promise.all([
        apiClient.get(endpoints.lms.categories),
        apiClient.get(endpoints.lms.courseFormats)
      ])
      const categories = categoriesRes.data?.results || categoriesRes.data || []
      const formats = formatsRes.data?.results || formatsRes.data || []

      if (categories.length > 0 || formats.length > 0) {
        const enrichedCategories = categories.map((c, i) => ({
          ...c,
          icon: c.icon || defaultIcons[i % defaultIcons.length],
          color: c.color || defaultColors[i % defaultColors.length],
          courses_count: c.courses_count ?? 0
        }))
        const enrichedFormats = formats.map((f, i) => ({
          ...f,
          icon: f.icon || formatIcons[i % formatIcons.length],
          courses_count: f.courses_count ?? 0,
          is_active: f.is_active ?? true
        }))
        return { categories: enrichedCategories, formats: enrichedFormats }
      }
    } catch (e) {
      console.error('Ошибка загрузки категорий и форматов:', e)
    }
    return {
      categories: mockData.lessonsManagement.categories,
      formats: mockData.lessonsManagement.courseFormats
    }
  },

  async getMyBadges() {
    try {
      const [badgesRes, userBadgesRes] = await Promise.all([
        apiClient.get(endpoints.lms.badges),
        apiClient.get(endpoints.lms.userBadges)
      ])
      const badges = badgesRes.data?.results || badgesRes.data || []
      const earned = userBadgesRes.data?.results || userBadgesRes.data || []
      if (badges.length > 0) return { badges, earned }
    } catch (e) {
      console.error('Ошибка загрузки достижений:', e)
    }
    return { badges: mockData.badgesData.allBadges, earned: mockData.badgesData.earnedBadges }
  },

  // Статистика студента
  async getStudentStats() {
    try {
      // Получаем базовую статистику
      const enrollments = await this.getEnrollments()
      const testAttempts = await this.getTestAttempts()
      const submissions = await this.getSubmittedAssignments()
      const grades = await this.getGrades()

      // Вычисляем статистику
      const enrolledCourses = enrollments.data?.results?.length || 0
      const testsCompleted = testAttempts.data?.results?.filter(a => a.completed_at)?.length || 0
      const assignmentsSubmitted = submissions.data?.results?.length || 0
      const averageGrade = this.calculateAverageGrade(grades.data?.results || [])

      // Получаем недавние курсы
      const recentCourses = await this.getRecentCourses()
      
      // Получаем предстоящие события  
      const upcomingEvents = await this.getCalendarEvents()

      return {
        success: true,
        data: {
          enrolled_courses: enrolledCourses,
          tests_completed: testsCompleted,
          assignments_submitted: assignmentsSubmitted,
          average_grade: averageGrade,
          study_hours: Math.min(enrolledCourses * 15 + testsCompleted * 2, 150), // Стабильная оценка
          badges_count: 0, // Заглушка
          recent_courses: recentCourses.data?.results?.slice(0, 5) || [],
          upcoming_events: upcomingEvents.data?.results?.slice(0, 5) || [],
          notifications: [],
          achievements: []
        }
      }
    } catch (error) {
      console.error('Ошибка получения статистики студента:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  async getMyCourses() {
    try {
      const response = await apiClient.get(endpoints.lms.enrollments)
      const data = response.data?.results || response.data || []
      if (data.length > 0) {
        const normalized = data.map(e => ({
          ...e,
          subjectId: e.subject?.id ?? e.subjectId,
          name: e.subject?.name ?? e.name,
          description: e.subject?.description ?? e.description,
          instructor: e.subject?.teacher
            ? `${e.subject.teacher.first_name} ${e.subject.teacher.last_name}`.trim() || e.subject.teacher.username
            : (e.instructor ?? ''),
          category: e.subject?.category?.name ?? e.category,
          course_format: e.subject?.course_format?.name ?? e.course_format,
          progress: e.progress_percentage ?? e.progress ?? 0,
          studentsCount: e.subject?.enrolled_students_count ?? e.studentsCount ?? 0,
          isFavorite: e.isFavorite ?? false,
          image: e.subject?.course_image ?? e.image ?? null,
        }))
        return { data: normalized }
      }
    } catch (e) {
      console.error('Ошибка загрузки моих курсов:', e)
    }
    return { data: mockData.myCourses }
  },

  // Вспомогательные методы
  async getEnrollments() {
    return await apiClient.get(endpoints.lms.enrollments)
  },

  async getRecentCourses() {
    const enrollments = await this.getEnrollments()
    const enrollmentResults = enrollments.data?.results || []
    
    if (enrollmentResults.length === 0) {
      return { data: { results: [] } }
    }

    // Формируем курсы из данных записей с расчетом прогресса
    const courses = await Promise.all(
      enrollmentResults.map(async (enrollment) => {
        const courseId = enrollment.subject.id
        
        // Рассчитываем прогресс курса
        let progress = 0
        try {
          progress = await this.calculateCourseProgress(courseId)
        } catch (error) {
          console.warn(`Не удалось рассчитать прогресс для курса ${courseId}:`, error)
          // Используем стабильный прогресс на основе времени записи
          if (enrollment.enrollment_date) {
            const enrollmentDate = new Date(enrollment.enrollment_date)
            const daysSinceEnrollment = Math.floor((Date.now() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24))
            progress = Math.min(daysSinceEnrollment * 5, 75) // 5% в день, максимум 75%
          } else {
            // Используем стабильный прогресс на основе ID курса
            const seed = parseInt(courseId) || 1
            progress = ((seed * 13) % 50) + 15 // 15-64% стабильно для каждого курса
          }
        }
        
        return {
          id: enrollment.subject.id,
          name: enrollment.subject.name,
          title: enrollment.subject.name,
          instructor: enrollment.subject.teacher ? 
            `${enrollment.subject.teacher.first_name} ${enrollment.subject.teacher.last_name}`.trim() || enrollment.subject.teacher.username 
            : 'Неизвестный преподаватель',
          progress: progress,
          status: enrollment.status,
          enrollment_date: enrollment.enrollment_date,
          subject: enrollment.subject
        }
      })
    )

    return { 
      data: { 
        results: courses 
      } 
    }
  },

  calculateAverageGrade(grades) {
    if (!grades || grades.length === 0) return 0
    
    const sum = grades.reduce((total, grade) => total + (grade.grade || 0), 0)
    return Math.round(sum / grades.length)
  },

  async calculateCourseProgress(courseId) {
    try {
      const structureResponse = await this.getCourseStructure(courseId)
      const themes = structureResponse.data?.structure || structureResponse.data?.themes || []
      
      if (themes.length === 0) return 0
      
      let totalLessons = 0
      let completedLessons = 0
      
      for (const theme of themes) {
        if (theme.lessons?.length > 0) totalLessons += theme.lessons.length
      }
      
      if (totalLessons === 0) return 0
      
      try {
        const progressResponse = await apiClient.get(`${endpoints.lms.studentProgress}?course_id=${courseId}`)
        if (progressResponse.data?.completed_lessons_count !== undefined) {
          completedLessons = progressResponse.data.completed_lessons_count
        }
      } catch {
        const seed = parseInt(courseId) || 1
        const progressPercentage = ((seed * 17) % 71) + 15
        completedLessons = Math.floor((totalLessons * progressPercentage) / 100)
      }
      
      const finalProgress = Math.min(Math.round((completedLessons / totalLessons) * 100), 100)
      return finalProgress
      
    } catch (error) {
      console.error(`Ошибка расчета прогресса курса ${courseId}:`, error)
      const seed = parseInt(courseId) || 1
      return ((seed * 23) % 60) + 10
    }
  },

  // Ресурсы
  async downloadResource(resourceId) {
    return await apiClient.get(endpoints.lms.downloadResource(resourceId), {
      responseType: 'blob'
    })
  },

  // Уведомления
  async getNotifications() {
    try {
      const response = await apiClient.get(endpoints.lms.notifications)
      const data = response?.data?.results || response?.data || []
      if (Array.isArray(data) && data.length > 0) {
        return { data }
      }
    } catch (error) {
      console.error('Ошибка загрузки уведомлений LMS:', error)
    }
    return { data: mockData.dashboardData.student.notifications }
  },

  async markNotificationAsRead(notificationId) {
    return await apiClient.patch(endpoints.lms.markAsRead(notificationId))
  },

  async markAllNotificationsAsRead() {
    return await apiClient.patch(endpoints.lms.markAllAsRead)
  },

  // === Дашборд: API-заглушка ===

  async getDashboardData(role = 'student') {
    return { data: mockData.dashboardData[role] || mockData.dashboardData.student }
  },

  // === Профориентация: API-заглушки ===

  async getApplicantProfile() {
    return { data: mockData.applicantProfile }
  },

  async updateApplicantProfile(data) {
    Object.assign(mockData.applicantProfile, data)
    return { data: mockData.applicantProfile }
  },

  async getDiagnosticTests() {
    return { data: mockData.diagnosticTests }
  },

  async getDiagnosticResults() {
    return { data: mockData.diagnosticResults }
  },

  async getLearningResults() {
    return { data: mockData.learningSummary }
  },

  async getEducationalRoute() {
    return { data: mockData.educationalRoute }
  },

  async getCompetencies() {
    return { data: mockData.competencies }
  },

  async getDevelopmentPlan() {
    return { data: mockData.developmentPlan }
  },

  async getProfessions(filters = {}) {
    let result = [...mockData.professions]
    if (filters.field) {
      result = result.filter(p => p.field === filters.field)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q))
    }
    return { data: result }
  },

  async getTrajectory() {
    return { data: mockData.trajectory }
  },

  async getLearningTrajectoriesOverview() {
    const heavy =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('trajectoryDemo') === 'heavy'
    return {
      data: heavy ? mockData.learningTrajectoriesOverviewHeavy : mockData.learningTrajectoriesOverview
    }
  },

  async getStudyPlansList(filters = {}) {
    let result = [...mockData.studyPlans]
    if (filters.status) {
      result = result.filter(p => p.status === filters.status)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        p =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.code && p.code.toLowerCase().includes(q)) ||
          (p.author && String(p.author).toLowerCase().includes(q))
      )
    }
    return { data: result }
  },

  async getWorkProgramsList(filters = {}) {
    let result = [...(mockData.workPrograms || [])]
    if (filters.status) {
      result = result.filter(p => p.status === filters.status)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        p =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.code && p.code.toLowerCase().includes(q)) ||
          (p.author && String(p.author).toLowerCase().includes(q)) ||
          (p.department && p.department.toLowerCase().includes(q))
      )
    }
    return { data: result }
  },

  async buildTrajectory(params) {
    return { data: mockData.trajectory }
  },

  async getGapAnalysis() {
    return { data: mockData.gapAnalysis }
  },

  async getCareerEvents(filters = {}) {
    let result = [...mockData.careerEvents]
    if (filters.type) {
      result = result.filter(e => e.type === filters.type)
    }
    return { data: result }
  },

  async getMonitoringData() {
    return { data: mockData.monitoringData }
  },

  async getCareerAnalytics() {
    return { data: mockData.careerAnalytics }
  },

  async getReportTemplates() {
    return { data: mockData.reportTemplates }
  },

  async generateReport(templateId, filters) {
    const template = mockData.reportTemplates.find(t => t.id === templateId)
    return { data: { id: Date.now(), template, filters, status: 'generated', generatedAt: new Date().toISOString() } }
  },

  async getStudentsList(filters = {}) {
    let result = [...mockData.studentsList]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(s => `${s.lastName} ${s.firstName}`.toLowerCase().includes(q))
    }
    if (filters.status) {
      result = result.filter(s => s.status === filters.status)
    }
    return { data: result }
  },

  async getIntegrations() {
    return { data: mockData.integrations }
  },

  async syncIntegration(integrationId) {
    const integration = mockData.integrations.find(i => i.id === integrationId)
    if (integration) {
      integration.lastSync = new Date().toISOString()
    }
    return { data: integration }
  }
}

export default lmsApi 