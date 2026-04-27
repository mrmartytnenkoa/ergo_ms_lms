# Эксплуатация: миграции и данные

## Миграции Django

Схема и данные меню находятся в [api/migrations/](../api/migrations/). Применение изменений схемы в проекте выполняется стандартными командами утилиты **ergoms** (см. правила проекта), например:

- `ergoms db-migrate` — применить миграции
- `ergoms db-makemigrations` — создать миграции после правок моделей
- `ergoms migrate-all` — makemigrations + migrate

Не документируем здесь прямые вызовы `manage.py`.

## Начальные и демо-данные

- Сиды категорий, форматов, курсов: миграции `0003` и скрипты в [api/migrations/data/](../api/migrations/data/) (`populate_categories`, `populate_formats`, `populate_courses`, `populate_themes_lessons` и др. — фактический набор см. в миграциях).
- Команда генерации: [api/management/commands/generate_lms_data.py](../api/management/commands/generate_lms_data.py). Запуск через `ergoms api generate_lms_data` с опциями `--courses`, `--users`, `--clear`, `--preserve-users` (полный список аргументов — в коде команды `add_arguments`).

## Логи и отладка

Для диагностики контента курсов на API есть `GET /api/lms/analytics/debug-lessons/` (см. [05b-api-actions.md](05b-api-actions.md)). В `ThemeViewSet` в коде присутствуют отладочные `print` — при шуме в логах стоит заменить на logger в рамках отдельной задачи.

## Статика и медиа

Сборка статики ядра/проекта не специфична для LMS; загруженные файлы курсов и ресурсов зависят от `MEDIA_ROOT` / CDN-настроек глобальной конфигурации.
