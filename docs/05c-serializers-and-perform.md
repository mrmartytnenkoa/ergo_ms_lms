# Сериализаторы по ViewSet и `perform_*` (п. 3 плана)

Источник: [api/views.py](../api/views.py), [api/serializers.py](../api/serializers.py).

## Матрица: действие → класс сериализатора

| ViewSet | Чтение / list / retrieve | create | update / partial_update |
|---------|--------------------------|--------|-------------------------|
| `UserProfileViewSet` | `LMSUserProfileSerializer` | — | тот же (PATCH через `my_profile`) |
| `UserRoleViewSet` | `UserRoleSerializer` | — | — |
| `CourseCategoryViewSet` | `CourseCategorySerializer` | тот же | тот же |
| `CourseFormatViewSet` | `CourseFormatSerializer` | тот же | тот же |
| `GradeViewSet` | `GradeSerializer` | тот же | тот же |
| `SubjectViewSet` | `SubjectSerializer` | `CreateSubjectSerializer` | `UpdateSubjectSerializer` |
| `EnrollmentViewSet` | `EnrollmentSerializer` | `CreateEnrollmentSerializer` | тот же |
| `ThemeViewSet` | `ThemeSerializer` | `CreateThemeSerializer` | `UpdateThemeSerializer` |
| `LessonViewSet` | `LessonSerializer` | `CreateLessonSerializer` | `UpdateLessonSerializer` |
| `ForumViewSet` | `ForumSerializer` | `CreateForumSerializer` | `CreateForumSerializer` |
| `ForumDiscussionViewSet` | `ForumDiscussionSerializer` | тот же | тот же |
| `ForumPostViewSet` | `ForumPostSerializer` | тот же | тот же |
| `TestBankViewSet` | `TestBankSerializer` | тот же | тот же |
| `TestViewSet` | `TestSerializer` | `CreateTestSerializer` | `UpdateTestSerializer` |
| `TestAttemptViewSet` | `TestAttemptSerializer` | тот же | тот же |
| `AssignmentViewSet` | `AssignmentSerializer` | `CreateAssignmentSerializer` | тот же |
| `SubmittedAssignmentViewSet` | `SubmittedAssignmentSerializer` | `CreateSubmittedAssignmentSerializer` | тот же |
| `CalendarEventViewSet` | `CalendarEventSerializer` | тот же | тот же |
| `BadgeViewSet` | `BadgeSerializer` | тот же | тот же |
| `UserBadgeViewSet` | `UserBadgeSerializer` | тот же | тот же |
| `NotificationViewSet` | `NotificationSerializer` | тот же | тот же |
| `PrivateMessageViewSet` | `PrivateMessageSerializer` | тот же | тот же |
| `QuestionViewSet` | `QuestionSerializer` | `CreateQuestionSerializer` | `CreateQuestionSerializer` |
| `AnswerViewSet` | `AnswerSerializer` | `CreateAnswerSerializer` | `CreateAnswerSerializer` |
| `ResourceViewSet` | `ResourceSerializer` | `CreateResourceSerializer` | `UpdateResourceSerializer` |
| `LessonItemViewSet` | `LessonItemSerializer` | тот же | тот же |
| `AnalyticsViewSet` | `StudentStatsSerializer` / `TeacherStatsSerializer` / вложенные сериализаторы в `dashboard` | — | — |

## `perform_*` в основном `views.py`

| Метод | ViewSet | Назначение |
|-------|---------|------------|
| `perform_update` | `SubjectViewSet` | Запрет правки не-владельцем (не admin) |
| `perform_destroy` | `SubjectViewSet` | Запрет удаления не-владельцем |
| `perform_create` | `ThemeViewSet` | Проверка, что курс принадлежит преподавателю (не admin) |
| `perform_create` | `ResourceViewSet` | Установка автора загрузки и проверки ролей |

Дополнительная логика создания/прав записана в `@action` и переопределениях `create`/`destroy` у отдельных ViewSet — смотрите исходный файл.

## `optimized_serializers.py`

Файл [api/optimized_serializers.py](../api/optimized_serializers.py) содержит `OptimizedSubjectSerializer`, `OptimizedThemeSerializer`, `OptimizedLessonSerializer`, `OptimizedAssignmentSerializer`. На момент аудита документации **ни один** из них не подключён в `views.py`; это запасной или незавершённый слой.
