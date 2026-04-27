# Обзор модуля LMS

## Назначение

Модуль реализует учебный портал: каталог и прохождение курсов (**Subject**), структура курса (**Theme**, **Lesson**), материалы (**Resource**), тесты и задания, форумы, календарь, оценки, уведомления, значки, личные сообщения и аналитика. Часть сценариев профориентации и конструкторы учебных/рабочих планов на клиенте реализованы поверх **mock-данных** (см. [08-client.md](08-client.md) и [11-known-gaps.md](11-known-gaps.md)).

## Границы модуля

- **Сервер**: Django-приложение `modules.lms.api` (`label = lms`), единый крупный слой ViewSet в `api/views.py`, модели в `api/models.py`.
- **Клиент**: Vue 3 под префиксом маршрута `/lms`, сборка как workspace-пакет `@ergo-ms/lms-client`.
- **Ядро**: модуль не изменяет ядро ради собственной логики; регистрируется через автообнаружение приложений и URL (см. [03-integration-core.md](03-integration-core.md)).

## Термины

| Термин | Модель / смысл |
|--------|----------------|
| Курс | `Subject` — учебный курс с преподавателем, категорией, форматом, датами, флагом публикации |
| Тема | `Theme` — раздел внутри курса, порядок `sort_order` |
| Урок | `Lesson` — единица контента в теме; тип `lessontype` (видео, лекция, тест и т.д.) |
| Элемент урока | `LessonItem` — ровно одна связь: тест, задание или ресурс, привязанная к уроку |
| Запись на курс | `Enrollment` — студент + курс, статус и `progress_percentage` |
| Задание / сдача | `Assignment` / `SubmittedAssignment` |
| Тест | `Test`, вопросы `Question`, варианты `Answer`, попытка `TestAttempt` |

## Роли пользователей

В модели `UserRole` заданы значения: `student`, `teacher`, `admin`, `moderator`, `guest`. На клиенте дополнительно используются роли вроде `applicant`, `counselor`, `organizer`, `analyst` в `useUserRole.js` для навигации профориентации; на стороне API основная фильтрация строится вокруг `admin`, `teacher` и записей `Enrollment` для студентов.

Полная инвентаризация точек входа: [00-inventory.md](00-inventory.md).

## Ключевые файлы

- Приложение: [api/apps.py](../api/apps.py)
- Модели: [api/models.py](../api/models.py)
- API: [api/urls.py](../api/urls.py), [api/views.py](../api/views.py)
- Сериализаторы: [api/serializers.py](../api/serializers.py), [api/base_serializers.py](../api/base_serializers.py)
- Клиент: [client/js/routes.js](../client/js/routes.js), [client/js/lmsApi.js](../client/js/lmsApi.js), [client/ParentLayout.vue](../client/ParentLayout.vue)
