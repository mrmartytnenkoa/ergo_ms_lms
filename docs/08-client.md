# Клиентская часть LMS

## Маршруты

Файл [client/js/routes.js](../client/js/routes.js) экспортирует объект: ключ — **имя маршрута** Vue Router, значение — `path`, `component`, `meta` (title, `requiresAuth`).

Корневой layout: [client/ParentLayout.vue](../client/ParentLayout.vue) — маршрут `LMS` с префиксом `/lms`, `redirect` на дашборд. Навигация: массив кнопок с фильтрацией по ролям (иконки `lucide-vue-next`).

### Таблица маршрутов Vue Router (п. 4 плана: routes ↔ экраны)

Имя маршрута | Path | Компонент (от корня `client/`)
---|---|---
`LMS` | `/lms` | `ParentLayout.vue` (redirect `LMSDashboard`)
`LMSDashboard` | `/lms/dashboard` | `Dashboard/DashboardView.vue`
`LMSCatalog` | `/lms/catalog` | `Catalog/CatalogView.vue`
`LMSCourses` | `/lms/courses` | `Courses/CoursesView.vue`
`LMSGrades` | `/lms/grades` | `Grades/GradesView.vue`
`LMSCalendar` | `/lms/calendar` | `Calendar/CalendarView.vue`
`LMSBadges` | `/lms/badges` | `Badges/BadgesView.vue`
`LMSLessonsManagement` | `/lms/lessons-management` | `LessonsManagement/LessonsManagementView.vue`
`LMSCategoriesAndFormats` | `/lms/categories-and-formats` | `CategoriesAndFormats/CategoriesAndFormatsView.vue`
`LMSCourseView` | `/lms/course/:id` | `Courses/CourseView.vue`
`LMSEmployerInteraction` | `/lms/employer-interaction` | `EmployerInteraction/EmployerInteractionView.vue`
`LMSLearningTrajectories` | `/lms/learning-trajectories` | `LearningTrajectories/LearningTrajectoriesView.vue`
`LMSStudyPlansConstructor` | `/lms/study-plans-constructor` | `StudyPlansConstructor/StudyPlansConstructorView.vue`
`LMSWorkProgramsConstructor` | `/lms/work-programs-constructor` | `WorkProgramsConstructor/WorkProgramsConstructorView.vue`
`LMSApplicantProfile` | `/lms/applicant-profile` | `ApplicantProfile/ApplicantProfileView.vue`
`LMSDiagnostics` | `/lms/diagnostics` | `Diagnostics/DiagnosticsView.vue`
`LMSEducationalRoute` | `/lms/educational-route` | `EducationalRoute/EducationalRouteView.vue`
`LMSProfessionalDev` | `/lms/professional-development` | `ProfessionalDevelopment/ProfessionalDevelopmentView.vue`
`LMSProfessions` | `/lms/professions` | `Professions/ProfessionsView.vue`
`LMSTrajectory` | `/lms/trajectory` | `Trajectory/TrajectoryView.vue`
`LMSGapAnalysis` | `/lms/gap-analysis` | `GapAnalysis/GapAnalysisView.vue`
`LMSCareerCalendar` | `/lms/career-calendar` | `CareerCalendar/CareerCalendarView.vue`
`LMSMonitoring` | `/lms/monitoring` | `Monitoring/MonitoringView.vue`
`LMSCareerAnalytics` | `/lms/career-analytics` | `CareerAnalytics/CareerAnalyticsView.vue`
`LMSReports` | `/lms/reports` | `Reports/ReportsView.vue`
`LMSStudentManagement` | `/lms/student-management` | `StudentManagement/StudentManagementView.vue`
`LMSIntegrations` | `/lms/integrations` | `Integrations/IntegrationsView.vue`
`LMSNotifications` | `/lms/notifications` | `Notifications/NotificationsView.vue`

Связка с `lmsApi`: экраны дергают методы из [lmsApi.js](../client/js/lmsApi.js) (импорт в каждом view по месту). Общий принцип — **ядро каталога/курсов/оценок** через REST; **профориентация и конструкторы** — преимущественно mock (списки ниже).

## API на клиенте

- База путей: [client/js/endpoints.js](../client/js/endpoints.js) — объект `lmsEndpoints.lms` (относительные пути сегмента `lms/...`).
- HTTP-обёртка: [client/js/lmsApi.js](../client/js/lmsApi.js) импортирует `apiClient` из `@/js/api/manager` и `endpoints` из `@/js/api/endpoints` (ядро агрегирует модульные endpoints).

## Реальный REST vs mock

### В основном через `apiClient` (с fallback на mock при ошибке/пустом ответе)

Примеры: `getCourses`, `getCourse`, `getCourseStructure`, `enrollInCourse`, `getLessons`, `getLessonItems`, `getTests`, `startTest`, `getAssignments`, `submitAssignment`, `getSubmittedAssignments`, `getCalendarEvents`, `getUpcomingEvents`, `getCalendarData`, `getGrades` / `getMyGrades`, `getCatalogCourses`, `getCategoriesAndFormats`, `getMyBadges`, `getStudentStats` (агрегирует несколько запросов), `getMyCourses`, `getEnrollments`, `getRecentCourses`, `calculateCourseProgress`, `downloadResource`, `getNotifications`, `markNotificationAsRead`, `markAllNotificationsAsRead`, `getDashboardData`.

### Только mock (локальные данные `mockData.js`, без успешного бэкенда)

Методы ниже **не** имеют соответствующих реализованных маршрутов в [api/urls.py](../api/urls.py) на момент составления документации (часть путей объявлена в `endpoints.js`, но сервер их не обслуживает):

- `getApplicantProfile`, `updateApplicantProfile`
- `getDiagnosticTests`, `getDiagnosticResults`, `getLearningResults`
- `getEducationalRoute`, `getCompetencies`, `getDevelopmentPlan`
- `getProfessions`, `getTrajectory`, `getLearningTrajectoriesOverview`
- `getStudyPlansList`, `getWorkProgramsList`, `buildTrajectory`
- `getGapAnalysis`, `getCareerEvents`, `getMonitoringData`, `getCareerAnalytics`
- `getReportTemplates`, `generateReport`, `getStudentsList`
- `getIntegrations`, `syncIntegration`

Отдельно: `calculateCourseProgress` обращается к `endpoints.lms.studentProgress` (`lms/analytics/student/progress/`) — этого пути **нет** в `urls.py` модуля; при 404 используется локальная эвристика в `lmsApi.js`.

### Вспомогательный mock без API

- `getCourseStructureMock` — полностью локальная структура для демо/разработки.

## Прочее

- Крупный фикстурный файл: [client/js/mockData.js](../client/js/mockData.js).
- Стили и экраны разбиты по папкам (`Dashboard`, `Catalog`, `LessonsManagement`, `LearningTrajectories`, …).
