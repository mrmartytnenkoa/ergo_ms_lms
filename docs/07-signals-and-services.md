# Сигналы и сервисы

## Файл signals.py

Источник: [api/signals.py](../api/signals.py). Регистрируется при `AppConfig.ready()` в [api/apps.py](../api/apps.py).

### Пользователь

- `post_save` на `User` → `create_user_profile`: создаёт `UserProfile`; ошибки БД при отсутствии таблиц глотаются (`ProgrammingError` и др.).

### Учёба и оценки

- `Grade` (create) → уведомление студенту, проверка значков, обновление прогресса курса через `ProgressTrackingService`.
- `TestAttempt` (update, завершён) → автооценка через `GradingService`, значки при успешной сдаче.
- `SubmittedAssignment` (create/update) → уведомления преподавателю/студенту. **Внимание:** в ветке create используется цепочка `instance.assignment.lesson.theme.subject` — если у задания нет `lesson`, возможен `AttributeError` (см. [11-known-gaps.md](11-known-gaps.md)).

### Календарь и контент

- Новое `Assignment` → `CalendarService.create_assignment_deadline_event`.
- Новый `Test` с окнами доступности → события календаря.
- `ForumPost` → уведомления участникам, счётчики дискуссии, значки за активность.
- `Enrollment` → уведомления студенту и преподавателю; при завершении курса — значки.

### Значки

- `UserBadge` (create) → уведомление о награде.

### Валидация

- `pre_save` на `TestAttempt` — лимит попыток и окна доступности теста.
- `pre_save` на `SubmittedAssignment` — дедлайн и запрет поздней сдачи.

### LessonItem

При создании/изменении/удалении `Test`, `Assignment`, `Resource` с привязкой к `lesson` сигналы создают, пересоздают или удаляют соответствующие `LessonItem`.

### Периодические функции (не Celery)

В том же файле определены функции `send_assignment_reminders`, `cleanup_old_notifications`, `update_course_progress_for_all` — **не подключены** к планировщику внутри модуля; комментарии в коде допускают вызов из Celery/cron в будущем.

## Файл services.py

Классы (неполный перечень методов — смотрите исходник):

- **NotificationService** — фабрика уведомлений и сценарии (оценка, форум, дедлайн, значок).
- **BadgeService** — автоматическая выдача значков по контексту (`course_completion`, `test_completion`, `forum_participation` или полная проверка).
- **ProgressTrackingService** — расчёт прогресса (на момент документации зачёт завершённых уроков в `calculate_course_progress` может быть упрощён/заглушен — проверяйте актуальный код).
- **CalendarService** — события для заданий и тестов.
- **GradingService** — автоматическая оценка попыток теста.
- **ReportsService** — сбор структурированных отчётов по студенту/курсу (использование из API при необходимости ищите по проекту).
