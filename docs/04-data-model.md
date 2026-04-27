# Модель данных LMS

Источник правды: [api/models.py](../api/models.py). Ниже — логическая ER-модель и ограничения; физическая схема формируется миграциями в [api/migrations/](../api/migrations/).

## Миграции (п. 2 плана — сверка схемы)

| Файл | Содержание (кратко) |
|------|---------------------|
| [0001_initial.py](../api/migrations/0001_initial.py) | Первичная схема всех таблиц из `models.py` на момент ввода модуля |
| [0002_menu_data.py](../api/migrations/0002_menu_data.py) | Данные меню CMS «Управление обучением» |
| [0003_populate_categories_formats_courses.py](../api/migrations/0003_populate_categories_formats_courses.py) | Сиды категорий, форматов, курсов |
| `0004`–`0011` | Пункты меню (уведомления, траектории, конструкторы уч. планов и рабочих программ), исправления `route_name` |

При добавлении полей в модели всегда сравнивайте итог `0001` + последующие операции `AddField`/`AlterField` с текущим `models.py`. Документ описывает **логику** домена; точные типы колонок и индексы смотрите в актуальной миграции и в БД.

## Пользователи и роли

| Модель | Назначение |
|--------|------------|
| `UserRole` | M2M-логика ролей: `user` + `role` + `is_active`; `unique_together`: (`user`, `role`) |
| `UserProfile` | Расширение `User`: аватар, био, часовой пояс, язык, уведомления, контакты, дата рождения |
| `Teacher` | OneToOne с `User`: кафедра, степень, часы консультаций |
| `StudentGroup` | Группа: название, куратор (`Teacher`), специализация, курс |
| `Student` | OneToOne с `User`: группа, `student_id`, дата зачисления |

Роли в LMS API в основном читаются как `user.roles.values_list('role', flat=True)` без обязательной связи с `Student`/`Teacher`.

## Каталог курсов

| Модель | Назначение |
|--------|------------|
| `CourseCategory` | Дерево категорий: `parent` (self), `sort_order`, `is_visible` |
| `CourseFormat` | Формат обучения: уникальное `name`, `is_active` |
| `Subject` | Курс: `teacher` → `User`, `category`, `course_format`, даты, ключ записи, лимиты, `is_published`, флаги self-enrollment / completion / guest |

## Прохождение курса

| Модель | Назначение |
|--------|------------|
| `Enrollment` | `student` + `subject`, статус (`active` / `suspended` / `completed` / `cancelled`), `progress_percentage`, `completion_date` |
| `Theme` | Раздел курса: `subject`, порядок, видимость, `completion_required` |
| `Lesson` | Урок: `theme`, тип `LessonType`, бинарное поле `content` (legacy), окна доступности, видимость, порядок |

## Контент и активности

| Модель | Назначение |
|--------|------------|
| `Resource` | Файл: привязка к `subject` / `theme` / `lesson` (одна ветка), метаданные файла, счётчик скачиваний |
| `CourseFile` | Устаревшая схема файлов; посты форума могут ссылаться через M2M |
| `Forum`, `ForumDiscussion`, `ForumPost` | Форумы с привязкой к курсу/теме/уроку; вложенность постов через `parent` |
| `Assignment` | Задание на уровне курса/темы/урока; дедлайн, тип сдачи, лимиты файла |
| `SubmittedAssignment` | Сдача: студент, оценка, текст, бинарное поле `submittedassignment` |
| `TestBank` | Банк вопросов в рамках курса |
| `Test` | Тест; привязка к курсу/теме/уроку; лимиты попыток, окна доступности, проходной балл |
| `Question`, `Answer` | Вопросы и варианты |
| `TestAttempt`, `StudentAnswer`, `StudentAnswerSelection` | Прохождение теста |

## Унификация контента урока

`LessonItem`: поля `lesson`, `item_type` (`test` | `assignment` | `resource`), ровно одно из `test` / `assignment` / `resource`. Метод `clean()` проверяет ровно одну связь. `unique_together` предотвращает дубликаты пары урок–объект.

Сигналы при создании/удалении теста, задания и ресурса с заполненным `lesson` автоматически поддерживают `LessonItem` (см. [07-signals-and-services.md](07-signals-and-services.md)).

## Оценки, календарь, геймификация, коммуникации

| Модель | Назначение |
|--------|------------|
| `Grade` | Оценка по курсу: студент, предмет, выставитель, тип оценки |
| `CalendarEvent` | Событие в календаре курса |
| `Badge`, `UserBadge` | Значки и выдача пользователю |
| `Notification` | Внутрисистемные уведомления |
| `PrivateMessage` | Личные сообщения между пользователями |

## Замечание по `UserBadge`

В `models.py` у класса `UserBadge` объявлены два последовательных блока `class Meta` — действует последний (`app_label` только). Ограничение `unique_together` из первого блока может не применяться; это зафиксировано в [11-known-gaps.md](11-known-gaps.md).
