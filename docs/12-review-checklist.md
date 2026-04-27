# Чеклист ревью документации / модуля (п. 7 плана)

Использовать при приёмке изменений в LMS или при обновлении этой документации.

## Ключевые сценарии API

- [ ] **Запись на курс (`enroll`)** — `POST /api/lms/subjects/<id>/enroll/`, отписка `unenroll`, ограничения в `SubjectViewSet`.
- [ ] **Тесты** — `POST /api/lms/tests/<id>/start/`, попытки `test-attempts/`, согласованность с клиентом `submitTest` и вложенным `assessment/` (см. [11-known-gaps.md](11-known-gaps.md)).
- [ ] **Задания** — CRUD `assignments/`, сдачи `submitted-assignments/`, сигналы при `lesson is null` ([07-signals-and-services.md](07-signals-and-services.md)).
- [ ] **Форум** — цепочка `forums/` → `discussions/` → `posts/`, уведомления в сигналах.
- [ ] **Календарь** — `calendar/`, `calendar/upcoming/`, события из сигналов для заданий/тестов.
- [ ] **Уведомления** — `notifications/`, `read`, `read-all`, фильтр `is_read`.

## Данные и миграции

- [ ] Схема согласована с [04-data-model.md](04-data-model.md) и последними миграциями.
- [ ] Меню CMS для `module_source='modules/lms'` не конфликтует с именами маршрутов Vue ([03-integration-core.md](03-integration-core.md)).

## Клиент

- [ ] Таблица маршрутов в [08-client.md](08-client.md) соответствует `routes.js`.
- [ ] Методы **mock-only** в `lmsApi.js` по-прежнему без REST — или добавлен бэкенд и обновлена дока.

## Качество кода (не блокер доки, но фиксируется в gaps)

- [ ] Дублирование `UserBadge.Meta`, вложенные `print` в `ThemeViewSet` / `ResourceViewSet`, монолит `views.py` ([11-known-gaps.md](11-known-gaps.md)).
