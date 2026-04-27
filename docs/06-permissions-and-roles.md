# Права доступа и роли

## Базовые классы API

Файл [api/base_views.py](../api/base_views.py):

- `BaseLMSViewSet` — `IsAuthenticated`, стандартные `filter_backends` (DjangoFilter, Search, Ordering).
- `UserOwnedViewSet` — queryset по `user=request.user` (профиль).
- `SubjectRelatedViewSet` — упрощённая модель: `admin` видит всё; `teacher` — свои курсы и опубликованные чужие; иначе только опубликованные курсы (для связанных с `subject` объектов).
- `ReadOnlyLMSViewSet` — `IsAuthenticatedOrReadOnly`.

Многие ViewSet в [api/views.py](../api/views.py) **переопределяют** `get_queryset` и проверяют роли через `user.roles.values_list('role', flat=True)` и/или `Enrollment` для студентов.

## Типичные правила по доменам

- **Категории / форматы**: админ и преподаватель видят всё; студент — категории, в которых есть опубликованные курсы (см. `CourseCategoryViewSet.get_queryset`).
- **Subject**: создание/редактирование обычно только преподаватель-владелец или админ; студенты получают опубликованные курсы и курсы, на которые записаны.
- **Запись на курс (`enroll`)**: проверки в `SubjectViewSet` (уже записан, лимиты, ключ записи и т.д. — см. реализацию метода).
- **Темы/уроки**: студент видит темы только курсов с активной записью (`ThemeViewSet`); преподаватель — свои + опубликованные.
- **Попытки тестов**: `TestAttemptViewSet` — только свои попытки.
- **Аналитика преподавателя**: `teacher_stats` возвращает 403, если нет ролей `teacher` или `admin`.

## Клиент

- [client/composables/useUserRole.js](../client/composables/useUserRole.js) загружает роли с `GET /api/lms/user/roles/` и может переключать активную роль через `POST /api/lms/user/roles/switch/`.
- Флаг **`allowAll = true`** в этом composable на момент написания документации **отключает** реальную проверку в `hasRole` / `canAccess` (всегда разрешает). Для продакшена это необходимо согласовать с политикой безопасности.
- Компонент [client/components/RoleGuard.vue](../client/components/RoleGuard.vue) скрывает целые разделы по списку ролей (например траектории — только `teacher` и `admin`).

## Swagger

ViewSet используют `SwaggerSafeMixin` из ядра для корректной генерации схемы при «фейковом» запросе от drf-yasg (`is_swagger_fake_view()` → пустой queryset).
