# Известные ограничения и технический долг

## Клиент и контракт API

1. **Mock-домены** — профориентация, траектории, учебные и рабочие планы, отчёты, интеграции и часть кабинетов реализованы в [lmsApi.js](../client/js/lmsApi.js) на `mockData.js` без бэкенда (список в [08-client.md](08-client.md)).
2. **`endpoints.js`** содержит ключи `learningTrajectories`, `studyPlans`, `workPrograms`, `studentProgress` — соответствующие ViewSet/маршруты в [api/urls.py](../api/urls.py) **отсутствуют**; `studentProgress` вызывается из клиента и ожидаемо получает ошибку с последующим fallback.
3. **`submitTest`** в [lmsApi.js](../client/js/lmsApi.js) вызывает `POST .../test-attempts/{id}/submit/` — в основном [api/urls.py](../api/urls.py) такого маршрута **нет**. Отдельный пакет [api/assessment/](../api/assessment/) объявляет `submit_attempt` на уровне теста (`.../assessment/tests/<pk>/submit_attempt/`), но клиент его не использует; требуется унификация контракта.

## Сервер

1. **Монолит** — [api/views.py](../api/views.py) очень большой; сопровождение усложнено.
2. **Дублирование маршрутов** — основной роутер + вложенные `courses`/`assignments`/`users` (см. [09-nested-apps.md](09-nested-apps.md)); риск расхождения поведения.
3. **`UserBadge`** — двойной `class Meta` в [models.py](../api/models.py); возможна потеря `unique_together`.
4. **Сигналы и nullable `lesson` у `Assignment`** — см. [07-signals-and-services.md](07-signals-and-services.md).
5. **`assignments` nested API** — подозрительный фильтр в `AssignmentSubmissionViewSet.get_queryset`.
6. **Отладочные `print`** в `ThemeViewSet.get_queryset` / `perform_create` — загрязняют stdout.

## Клиент — безопасность UX

- **`allowAll = true`** в [useUserRole.js](../client/composables/useUserRole.js) отключает реальные проверки `hasRole`/`canAccess`; сервер остаётся источником истины, но UI не отражает отказ в доступе.

## План закрытия пробелов (вне текущей документации)

Приоритизация: согласовать единый REST для конструкторов и профориентации, удалить или подключить неиспользуемые nested routes, исправить модель `UserBadge` и сигналы, вынести ViewSet по файлам.
