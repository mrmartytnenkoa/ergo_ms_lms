# REST API: кастомные пути и действия

Все пути от корня **`/api/lms/`**.

## Явные `path()` в urls.py

| Метод | Путь | Handler | Назначение |
|-------|------|---------|------------|
| GET | `analytics/student/` | `student_stats` | Агрегаты по текущему пользователю |
| GET | `analytics/teacher/` | `teacher_stats` | Только роли teacher/admin |
| GET | `analytics/dashboard/` | `dashboard` | Дедлайны, уведомления, последние оценки |
| GET | `analytics/debug-lessons/` | `debug_lessons` | Диагностика видимости данных |
| GET, PATCH | `profile/me/` | `my_profile` | Профиль текущего пользователя |
| GET | `user/roles/` | `current` | Список ролей |
| POST | `user/roles/switch/` | `switch_role` | Переключение активной роли |
| POST | `subjects/<pk>/enroll/` | `enroll` | Запись на курс |
| DELETE | `subjects/<pk>/unenroll/` | `unenroll` | Отписка |
| GET | `subjects/<pk>/students/` | `enrolled_students` | Студенты курса |
| POST | `subjects/<pk>/duplicate/` | `duplicate` | Дублирование курса |
| PATCH | `subjects/<pk>/toggle-published/` | `toggle_published` | Публикация |
| GET | `subjects/<pk>/structure/` | `structure` | Дерево тем/уроков |
| POST | `themes/<pk>/reorder-lessons/` | `reorder_lessons` | Порядок уроков в теме |
| POST | `themes/reorder-themes/` | `reorder_themes` | Порядок тем |
| POST | `lessons/<pk>/duplicate/` | `duplicate` | Дублирование урока |
| PATCH | `lessons/<pk>/toggle-visibility/` | `toggle_visibility` | Видимость урока |
| GET | `lessons/by-course/` | `by_course` | Список уроков по курсу (query) |
| GET | `lesson-items/by-lesson/` | `by_lesson` | Элементы урока (`lesson_id`) |
| POST | `lesson-items/reorder/` | `reorder` | Порядок элементов |
| POST | `lesson-items/migrate/` | `migrate_existing` | Миграция legacy-связей |
| GET | `resources/<pk>/download/` | `download` | Скачивание файла |
| PATCH | `resources/<pk>/toggle-visibility/` | `toggle_visibility` | Видимость ресурса |
| GET | `resources/by-context/` | `by_context` | Ресурсы по контексту |
| POST | `tests/<pk>/start/` | `start_attempt` | Начать попытку теста |
| GET | `calendar/upcoming/` | `upcoming` | Ближайшие события |
| PATCH | `notifications/<pk>/read/` | `mark_as_read` | Прочитано |
| PATCH | `notifications/read-all/` | `mark_all_as_read` | Все прочитаны |

## Дополнительные `@action` на роутере (могут давать URL вида `/api/lms/<set>/<action>/`)

Обнаружены в [api/views.py](../api/views.py):

- **TestViewSet**: `reorder_tests` (POST, detail=False), `duplicate` (POST, detail=True).
- **AssignmentViewSet**: `reorder_assignments` (POST, detail=False).

Точные URL формируются DRF из имени метода; для проверки используйте schema Swagger или `ergoms api show_urls` (если доступна команда показа URL в проекте).

## Индекс ViewSet (для навигации по коду)

Классы в `views.py`: `UserProfileViewSet`, `CourseCategoryViewSet`, `CourseFormatViewSet`, `GradeViewSet`, `SubjectViewSet`, `EnrollmentViewSet`, `ThemeViewSet`, `LessonViewSet`, `ForumViewSet`, `ForumDiscussionViewSet`, `ForumPostViewSet`, `TestBankViewSet`, `TestViewSet`, `TestAttemptViewSet`, `AssignmentViewSet`, `SubmittedAssignmentViewSet`, `CalendarEventViewSet`, `BadgeViewSet`, `UserBadgeViewSet`, `NotificationViewSet`, `PrivateMessageViewSet`, `AnalyticsViewSet`, `UserRoleViewSet`, `QuestionViewSet`, `AnswerViewSet`, `ResourceViewSet`, `LessonItemViewSet`.
