# Техническая документация модуля LMS

Модуль **LMS** (`modules/lms`) в интерфейсе системы отображается как раздел **«Управление обучением»**. Здесь собрана техническая документация для разработчиков и сопровождения: архитектура, модель данных, REST API, клиент Vue.js, интеграция с ядром ERGO MS, эксплуатация и известные ограничения.

## Оглавление

| № | Документ | Описание |
|---|----------|----------|
| 0 | [00-inventory.md](00-inventory.md) | Инвентаризация URL и ViewSet (п. 1 плана) |
| 1 | [01-overview.md](01-overview.md) | Назначение, термины, роли |
| 2 | [02-architecture.md](02-architecture.md) | Слои системы, потоки данных |
| 3 | [03-integration-core.md](03-integration-core.md) | URL discovery, меню CMS, задачи ядра |
| 4 | [04-data-model.md](04-data-model.md) | Сущности БД и связи |
| 5 | [05-api-reference.md](05-api-reference.md) | REST: роутер и кастомные пути |
| 6 | [05b-api-actions.md](05b-api-actions.md) | Доп. действия `@action` ViewSet |
| 6c | [05c-serializers-and-perform.md](05c-serializers-and-perform.md) | Сериализаторы по ViewSet, `perform_*`, optimized |
| 7 | [06-permissions-and-roles.md](06-permissions-and-roles.md) | Права API и клиента |
| 8 | [07-signals-and-services.md](07-signals-and-services.md) | Сигналы и сервисный слой |
| 9 | [08-client.md](08-client.md) | Маршруты, `lmsApi`, mock vs REST |
| 10 | [09-nested-apps.md](09-nested-apps.md) | Вложенные пакеты `courses`, `assignments`, `users`, `assessment` |
| 11 | [10-operations.md](10-operations.md) | Миграции, генерация данных, ergoms |
| 12 | [11-known-gaps.md](11-known-gaps.md) | Пробелы, технический долг |
| 13 | [12-review-checklist.md](12-review-checklist.md) | Чеклист ревью (п. 7 плана) |

Короткий вход в модуль с точки зрения репозитория: [../README.md](../README.md).
