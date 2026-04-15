export default {
  "LMS": {
    "path": "/lms",
    "component": "@/modules/lms/client/ParentLayout.vue",
    "redirect": "LMSDashboard",
    "meta": {
      "requiresAuth": true
    }
  },
  "LMSDashboard": {
    "path": "/lms/dashboard",
    "component": "@/modules/lms/client/Dashboard/DashboardView.vue",
    "meta": {
      "title": "Дашборд LMS",
      "requiresAuth": true
    }
  },
  "LMSCatalog": {
    "path": "/lms/catalog",
    "component": "@/modules/lms/client/Catalog/CatalogView.vue",
    "meta": {
      "title": "Каталог курсов",
      "requiresAuth": true
    }
  },
  "LMSCourses": {
    "path": "/lms/courses",
    "component": "@/modules/lms/client/Courses/CoursesView.vue",
    "meta": {
      "title": "Мои курсы",
      "requiresAuth": true
    }
  },
  "LMSGrades": {
    "path": "/lms/grades",
    "component": "@/modules/lms/client/Grades/GradesView.vue",
    "meta": {
      "title": "Оценки",
      "requiresAuth": true
    }
  },
  "LMSCalendar": {
    "path": "/lms/calendar",
    "component": "@/modules/lms/client/Calendar/CalendarView.vue",
    "meta": {
      "title": "Календарь LMS",
      "requiresAuth": true
    }
  },
  "LMSBadges": {
    "path": "/lms/badges",
    "component": "@/modules/lms/client/Badges/BadgesView.vue",
    "meta": {
      "title": "Достижения",
      "requiresAuth": true
    }
  },
  "LMSLessonsManagement": {
    "path": "/lms/lessons-management",
    "component": "@/modules/lms/client/LessonsManagement/LessonsManagementView.vue",
    "meta": {
      "title": "Управление курсами",
      "requiresAuth": true
    }
  },
  "LMSCategoriesAndFormats": {
    "path": "/lms/categories-and-formats",
    "component": "@/modules/lms/client/CategoriesAndFormats/CategoriesAndFormatsView.vue",
    "meta": {
      "title": "Структура курсов",
      "requiresAuth": true
    }
  },
  "LMSCourseView": {
    "path": "/lms/course/:id",
    "component": "@/modules/lms/client/Courses/CourseView.vue",
    "meta": {
      "title": "Просмотр курса",
      "requiresAuth": true
    }
  },
  "LMSEmployerInteraction": {
    "path": "/lms/employer-interaction",
    "component": "@/modules/lms/client/EmployerInteraction/EmployerInteractionView.vue",
    "meta": {
      "title": "Взаимодействие с работодателями",
      "requiresAuth": true
    }
  },
  "LMSLearningTrajectories": {
    "path": "/lms/learning-trajectories",
    "component": "@/modules/lms/client/LearningTrajectories/LearningTrajectoriesView.vue",
    "meta": {
      "title": "Траектории обучения",
      "requiresAuth": true
    }
  },
  "LMSStudyPlansConstructor": {
    "path": "/lms/study-plans-constructor",
    "component": "@/modules/lms/client/StudyPlansConstructor/StudyPlansConstructorView.vue",
    "meta": {
      "title": "Конструктор учебных планов",
      "requiresAuth": true
    }
  },
  "LMSApplicantProfile": {
    "path": "/lms/applicant-profile",
    "component": "@/modules/lms/client/ApplicantProfile/ApplicantProfileView.vue",
    "meta": { "title": "Профиль абитуриента", "requiresAuth": true }
  },
  "LMSDiagnostics": {
    "path": "/lms/diagnostics",
    "component": "@/modules/lms/client/Diagnostics/DiagnosticsView.vue",
    "meta": { "title": "Диагностика", "requiresAuth": true }
  },
  "LMSEducationalRoute": {
    "path": "/lms/educational-route",
    "component": "@/modules/lms/client/EducationalRoute/EducationalRouteView.vue",
    "meta": { "title": "Карта образовательного маршрута", "requiresAuth": true }
  },
  "LMSProfessionalDev": {
    "path": "/lms/professional-development",
    "component": "@/modules/lms/client/ProfessionalDevelopment/ProfessionalDevelopmentView.vue",
    "meta": { "title": "Кабинет профессионального развития", "requiresAuth": true }
  },
  "LMSProfessions": {
    "path": "/lms/professions",
    "component": "@/modules/lms/client/Professions/ProfessionsView.vue",
    "meta": { "title": "Перечень профессий", "requiresAuth": true }
  },
  "LMSTrajectory": {
    "path": "/lms/trajectory",
    "component": "@/modules/lms/client/Trajectory/TrajectoryView.vue",
    "meta": { "title": "Образовательная траектория", "requiresAuth": true }
  },
  "LMSGapAnalysis": {
    "path": "/lms/gap-analysis",
    "component": "@/modules/lms/client/GapAnalysis/GapAnalysisView.vue",
    "meta": { "title": "Анализ разрывов", "requiresAuth": true }
  },
  "LMSCareerCalendar": {
    "path": "/lms/career-calendar",
    "component": "@/modules/lms/client/CareerCalendar/CareerCalendarView.vue",
    "meta": { "title": "Календарь мероприятий", "requiresAuth": true }
  },
  "LMSMonitoring": {
    "path": "/lms/monitoring",
    "component": "@/modules/lms/client/Monitoring/MonitoringView.vue",
    "meta": { "title": "Мониторинг", "requiresAuth": true }
  },
  "LMSCareerAnalytics": {
    "path": "/lms/career-analytics",
    "component": "@/modules/lms/client/CareerAnalytics/CareerAnalyticsView.vue",
    "meta": { "title": "Аналитика профориентации", "requiresAuth": true }
  },
  "LMSReports": {
    "path": "/lms/reports",
    "component": "@/modules/lms/client/Reports/ReportsView.vue",
    "meta": { "title": "Формирование отчетов", "requiresAuth": true }
  },
  "LMSStudentManagement": {
    "path": "/lms/student-management",
    "component": "@/modules/lms/client/StudentManagement/StudentManagementView.vue",
    "meta": { "title": "Управление обучающимися", "requiresAuth": true }
  },
  "LMSIntegrations": {
    "path": "/lms/integrations",
    "component": "@/modules/lms/client/Integrations/IntegrationsView.vue",
    "meta": { "title": "Интеграции", "requiresAuth": true }
  },
  "LMSNotifications": {
    "path": "/lms/notifications",
    "component": "@/modules/lms/client/Notifications/NotificationsView.vue",
    "meta": { "title": "Уведомления", "requiresAuth": true }
  }
}

