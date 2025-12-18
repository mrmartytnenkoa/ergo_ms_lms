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
  }
}

