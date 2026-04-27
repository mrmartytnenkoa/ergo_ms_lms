# Интеграция модуля LMS с ядром ERGO MS

## Регистрация URL

Конфигурация корня API: [core/api/src/config/urls.py](../../../core/api/src/config/urls.py). Класс `ModuleDiscoverer` в [core/api/src/core/utils/auto_api/auto_config.py](../../../core/api/src/core/utils/auto_api/auto_config.py):

- Обходит `modules/<имя>/api/`.
- Для каждого пакета с `urls.py`, чей базовый Django-app (`modules.<имя>.api`) присутствует в `INSTALLED_APPS`, добавляет `path("<сегменты>/", include("<полный_модуль>.urls"))`.
- Для приложения `modules.lms.api` сегменты после удаления `modules.` и `.api` дают префикс **`lms/`**.

Итог: REST модуля доступен по **`/api/lms/`**.

Вложенные пакеты с собственным `urls.py` (например `modules.lms.api.courses`) получают префиксы **`lms/courses/`**, **`lms/assignments/`**, **`lms/users/`** — см. [09-nested-apps.md](09-nested-apps.md).

## Регистрация приложения Django

Приложение задаётся в [api/apps.py](../api/apps.py): `name = 'modules.lms.api'`, `label = 'lms'`. Попадание в `INSTALLED_APPS` выполняется механизмом автообнаружения модулей ядра (не ручная правка списка в репозитории модуля).

## Меню CMS

Миграции данных в `api/migrations/` создают и корректируют пункты меню с `module_source='modules/lms'`:

- Базовое меню: [0002_menu_data.py](../api/migrations/0002_menu_data.py) — корневая группа «Управление обучением», дочерние маршруты (`LMSDashboard`, `LMSCatalog`, …).
- Дополнения: уведомления (`0004`), траектории (`0005`–`0007`), конструктор учебных планов (`0008`–`0010`), рабочие программы (`0011`).

Поля `route_name` должны совпадать с именами маршрутов Vue Router (не с URL-путями); исправления отражены в миграциях `0006`, `0007`, `0009`.

## Задачи ядра, обращающиеся к LMS

В [core/api/src/core/cms/adp/tasks.py](../../../core/api/src/core/cms/adp/tasks.py) есть условные импорты `modules.lms.api.signals` (например, связанные с созданием профиля пользователя). Это **точка связности**: ядро не импортирует LMS при старте unconditionally, а вызывает при определённых сценариях задач.

## Принцип зависимостей

Модуль может импортировать публичные части ядра (`src.core...`). Ядро не должно содержать бизнес-импортов из `modules.lms` вне таких явных интеграционных крючков, как задачи CMS выше.
