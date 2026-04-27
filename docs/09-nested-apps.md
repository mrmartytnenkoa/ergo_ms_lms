# Вложенные пакеты API: courses, assignments, users

Каждый пакет содержит `apps.py` с отдельным `AppConfig` (`name` вида `modules.lms.api.<подпакет>`). При условии, что базовое приложение `modules.lms.api` установлено, `ModuleDiscoverer` подключает их `urls.py` под префиксами:

| Префикс URL | Пакет | Файл |
|-------------|-------|------|
| `/api/lms/courses/` | `modules.lms.api.courses` | [api/courses/urls.py](../api/courses/urls.py) |
| `/api/lms/assignments/` | `modules.lms.api.assignments` | [api/assignments/urls.py](../api/assignments/urls.py) |
| `/api/lms/users/` | `modules.lms.api.users` | [api/users/urls.py](../api/users/urls.py) |
| `/api/lms/assessment/` | `modules.lms.api.assessment` | [api/assessment/urls.py](../api/assessment/urls.py) |

Отдельное приложение `lms_assessment` ([api/assessment/apps.py](../api/assessment/apps.py)) дублирует часть сценариев тестов: `tests/`, `tests/<pk>/start_attempt/`, `tests/<pk>/submit_attempt/`, список `attempts/`. Подключение возможно только если конфигурация `INSTALLED_APPS` включает `modules.lms.api.assessment` (проверьте автообнаружение приложений в ядре). Основной UI использует [api/urls.py](../api/urls.py) и `tests/<pk>/start/`.

## courses

[api/courses/views.py](../api/courses/views.py) — альтернативные `SubjectViewSet`, `ThemeViewSet`, `LessonViewSet` с упрощённой фильтрацией через `hasattr(user, 'student')` / `teacher`. **Дублирует** часть функциональности основного роутера на `/api/lms/subjects/` и т.д. Клиентский `lmsApi` в основном использует основной роутер, не эти пути.

## assignments

[api/assignments/views.py](../api/assignments/views.py) — `AssignmentManagementViewSet`, `AssignmentSubmissionViewSet`. URL: `.../assignments/management/`, `.../assignments/submissions/`. В `get_queryset` у submission для студента используется опечатка уровня фильтра (`Student=` вместо `student=`) — при использовании этого API требуется ревизия кода.

## users

[api/users/views.py](../api/users/views.py) — `UserViewSet` (read-only), `TeacherViewSet`, `StudentViewSet`, `StudentGroupViewSet`; маршруты в [api/users/urls.py](../api/users/urls.py) (`teachers/`, `students/`, `groups/`). Импортируется `LMSUserSerializer` из сериализаторов модуля.

## Согласование с основным API

Основной контракт для UI описан в [05-api-reference.md](05-api-reference.md). Вложенные приложения следует считать **вторичными** или историческими до полной консолидации маршрутов.
