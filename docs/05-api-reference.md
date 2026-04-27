# REST API: базовый префикс и роутер

## Базовый URL

Все пути ниже относительно **`/api/lms/`** (корневой `api/` задаётся в конфигурации ядра, префикс `lms/` — автообнаружение модуля).

Аутентификация: как для остального API ядра (обычно JWT / сессия в зависимости от настроек клиента). ViewSet наследуют `permissions.IsAuthenticated`, кроме отдельных оговорок в коде.

## DefaultRouter — ресурсы

Методы по умолчанию для `ModelViewSet`: `list`, `create`, `retrieve`, `update`, `partial_update`, `destroy`, если не переопределено.

| Префикс ресурса | ViewSet | Фильтры (`filterset_fields`) | Поиск / сортировка |
|-----------------|---------|------------------------------|---------------------|
| `profiles/` | `UserProfileViewSet` | — | через `get_queryset` — только свой профиль |
| `user-roles/` | `UserRoleViewSet` | — | только роли текущего пользователя |
| `categories/` | `CourseCategoryViewSet` | — | `search`: name, description; ordering: sort_order, name |
| `course-formats/` | `CourseFormatViewSet` | — | аналогично категориям |
| `subjects/` | `SubjectViewSet` | `is_published`, `category`, `course_format` | search: name, description, summary |
| `enrollments/` | `EnrollmentViewSet` | `status`, `subject` | только записи текущего студента |
| `themes/` | `ThemeViewSet` | `subject`, `is_visible` | ordering: sort_order, creationdate |
| `lessons/` | `LessonViewSet` | `theme`, `lessontype`, `is_visible` | ordering: sort_order, creationdate |
| `lesson-items/` | `LessonItemViewSet` | `lesson`, `item_type` | ordering: sort_order, created_at |
| `resources/` | `ResourceViewSet` | `subject`, `theme`, `lesson`, `file_type`, `is_visible` | search, ordering |
| `forums/` | `ForumViewSet` | `subject`, `forum_type` | search |
| `discussions/` | `ForumDiscussionViewSet` | `forum`, `is_pinned`, `is_locked` | search, ordering |
| `posts/` | `ForumPostViewSet` | `discussion` | ordering |
| `test-banks/` | `TestBankViewSet` | `subject` | search |
| `tests/` | `TestViewSet` | `lesson`, `theme`, `subject`, `type`, `is_active` | search |
| `questions/` | `QuestionViewSet` | `test`, `type`, `difficulty` | search, ordering |
| `answers/` | `AnswerViewSet` | `question`, `is_correct` | — |
| `test-attempts/` | `TestAttemptViewSet` | — | только попытки текущего студента |
| `assignments/` | `AssignmentViewSet` | `lesson`, `theme`, `subject` | search, ordering |
| `grades/` | `GradeViewSet` | — | query `?student=me` или `?student=<id>`; search: subject__name, feedback |
| `submitted-assignments/` | `SubmittedAssignmentViewSet` | `assignment`, `grade` | разграничение студент/преподаватель |
| `calendar/` | `CalendarEventViewSet` | `subject`, `event_type` | ordering: start_date |
| `badges/` | `BadgeViewSet` | `badge_type`, `subject`, `is_active` | search |
| `user-badges/` | `UserBadgeViewSet` | — | выдача значков |
| `notifications/` | `NotificationViewSet` | `is_read`, `notification_type` | см. queryset |
| `messages/` | `PrivateMessageViewSet` | `is_read` | search по теме/тексту |
| `analytics/` | `AnalyticsViewSet` | ViewSet без модели | действия только через `@action` и отдельные `path` |

Подробные **кастомные пути** и **@action**, не попадающие в стандартные имена роутера, описаны в [05b-api-actions.md](05b-api-actions.md).

## Сериализаторы и `perform_*`

Таблица по ViewSet, ветвления `get_serializer_class` и хуки `perform_create` / `perform_update` / `perform_destroy`: [05c-serializers-and-perform.md](05c-serializers-and-perform.md).

Краткий обзор файлов: [api/serializers.py](../api/serializers.py), [api/base_serializers.py](../api/base_serializers.py); [api/optimized_serializers.py](../api/optimized_serializers.py) — см. 05c (не подключён к `views.py`).

## Аналитика: дублирование маршрутов

`AnalyticsViewSet` зарегистрирован в роутере (`analytics/`), но часть методов дополнительно проброшена в [api/urls.py](../api/urls.py) как отдельные URL (исторически/для явных имён): `analytics/student/`, `analytics/teacher/`, `analytics/dashboard/`, `analytics/debug-lessons/`. Клиент для статистики студента может использовать `endpoints.lms.studentStats` → **`analytics/student/`** (не вложенный путь под `analytics/{pk}/`).
