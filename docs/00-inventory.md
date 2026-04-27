# Инвентаризация публичных точек LMS (п. 1 плана)

## Корневой REST (`modules/lms/api/urls.py`)

- **Router** (`DefaultRouter`): см. таблицу в [05-api-reference.md](05-api-reference.md).
- **Явные `path()`**: см. [05b-api-actions.md](05b-api-actions.md).
- **ViewSet-классы** в [api/views.py](../api/views.py):  
  `UserProfileViewSet`, `CourseCategoryViewSet`, `CourseFormatViewSet`, `GradeViewSet`, `SubjectViewSet`, `EnrollmentViewSet`, `ThemeViewSet`, `LessonViewSet`, `ForumViewSet`, `ForumDiscussionViewSet`, `ForumPostViewSet`, `TestBankViewSet`, `TestViewSet`, `TestAttemptViewSet`, `AssignmentViewSet`, `SubmittedAssignmentViewSet`, `CalendarEventViewSet`, `BadgeViewSet`, `UserBadgeViewSet`, `NotificationViewSet`, `PrivateMessageViewSet`, `AnalyticsViewSet`, `UserRoleViewSet`, `QuestionViewSet`, `AnswerViewSet`, `ResourceViewSet`, `LessonItemViewSet`.

## Вложенные `urls.py` (префикс от `/api/lms/`)

| Модуль Django | Файл | Префикс URL |
|---------------|------|---------------|
| `modules.lms.api.courses` | [api/courses/urls.py](../api/courses/urls.py) | `courses/` |
| `modules.lms.api.assignments` | [api/assignments/urls.py](../api/assignments/urls.py) | `assignments/` |
| `modules.lms.api.users` | [api/users/urls.py](../api/users/urls.py) | `users/` |
| `modules.lms.api.assessment` | [api/assessment/urls.py](../api/assessment/urls.py) | `assessment/` |

Подробности и расхождения с основным роутером: [09-nested-apps.md](09-nested-apps.md).

## Клиент (`modules/lms/client`)

- Маршруты: [client/js/routes.js](../client/js/routes.js) — полная таблица «имя → путь → компонент»: [08-client.md](08-client.md#таблица-маршрутов-vue-router).
- HTTP: [client/js/lmsApi.js](../client/js/lmsApi.js), пути: [client/js/endpoints.js](../client/js/endpoints.js).

## Сериализаторы (файлы)

- [api/serializers.py](../api/serializers.py) — основной набор.
- [api/base_serializers.py](../api/base_serializers.py) — `LMSUserSerializer`, базовые миксины.
- [api/optimized_serializers.py](../api/optimized_serializers.py) — альтернативные «оптимизированные» сериализаторы курса/темы/урока/задания; **в `views.py` не импортируются** (см. [05c-serializers-and-perform.md](05c-serializers-and-perform.md)).
